import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// Each friend's most recent walk_session (if any) tells us their live
// status: still walking (now < expected_arrival_at), overdue (now is past
// it and they haven't marked arrived), or not currently walking.
router.get('/', async (req, res, next) => {
    try {
        const uid = req.auth.payload.sub;
        const { rows } = await pool.query(
            `SELECT u.id, u.name, u.avatar, u.email,
                    ws.origin, ws.destination, ws.started_at, ws.expected_arrival_at, ws.arrived_at
             FROM friends f
             JOIN users u ON u.id = f.friend_id
             LEFT JOIN LATERAL (
                 SELECT * FROM walk_sessions
                 WHERE user_id = f.friend_id
                 ORDER BY started_at DESC
                 LIMIT 1
             ) ws ON true
             WHERE f.user_id = $1
             ORDER BY u.name ASC`,
            [uid]
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    const client = await pool.connect();
    try {
        const uid = req.auth.payload.sub;
        const email = (req.body.email || '').trim().toLowerCase();
        if (!email) return res.status(400).json({ error: 'email is required' });

        const { rows: userRows } = await client.query(
            'SELECT id, name, avatar, email FROM users WHERE lower(email) = $1',
            [email]
        );
        if (!userRows.length) {
            return res.status(404).json({ error: 'No Herbuddy user found with that email' });
        }
        const friend = userRows[0];
        if (friend.id === uid) {
            return res.status(400).json({ error: "You can't add yourself as a friend" });
        }

        await client.query('BEGIN');
        await client.query(
            'INSERT INTO friends (user_id, friend_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
            [uid, friend.id]
        );
        await client.query(
            'INSERT INTO friends (user_id, friend_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
            [friend.id, uid]
        );
        await client.query('COMMIT');

        res.status(201).json(friend);
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        next(err);
    } finally {
        client.release();
    }
});

router.delete('/:friendId', async (req, res, next) => {
    const client = await pool.connect();
    try {
        const uid = req.auth.payload.sub;
        const { friendId } = req.params;

        await client.query('BEGIN');
        await client.query('DELETE FROM friends WHERE user_id = $1 AND friend_id = $2', [uid, friendId]);
        await client.query('DELETE FROM friends WHERE user_id = $1 AND friend_id = $2', [friendId, uid]);
        await client.query('COMMIT');

        res.status(204).send();
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        next(err);
    } finally {
        client.release();
    }
});

export default router;
