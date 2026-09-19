import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const uid = req.auth.payload.sub;
        const { rows } = await pool.query(
            'SELECT buddy_name FROM matched_buddies WHERE user_id = $1 ORDER BY matched_at ASC',
            [uid]
        );
        res.json(rows.map(r => r.buddy_name));
    } catch (err) {
        next(err);
    }
});

// Returns { created: true } the first time a given buddy is matched, or
// { created: false } if it already existed — the frontend only seeds the
// buddy's opening chat message on a true first match.
router.post('/', async (req, res, next) => {
    try {
        const uid = req.auth.payload.sub;
        const { buddy_name } = req.body;
        if (!buddy_name) return res.status(400).json({ error: 'buddy_name is required' });

        const { rows } = await pool.query(
            `INSERT INTO matched_buddies (user_id, buddy_name)
             VALUES ($1, $2)
             ON CONFLICT (user_id, buddy_name) DO NOTHING
             RETURNING *`,
            [uid, buddy_name]
        );
        res.status(201).json({ created: rows.length > 0 });
    } catch (err) {
        next(err);
    }
});

router.delete('/:buddyName', async (req, res, next) => {
    try {
        const uid = req.auth.payload.sub;
        const buddyName = decodeURIComponent(req.params.buddyName);

        await pool.query('DELETE FROM matched_buddies WHERE user_id = $1 AND buddy_name = $2', [uid, buddyName]);
        // Clean up their private chat thread too — it's scoped to this user+buddy only.
        await pool.query('DELETE FROM chat_messages WHERE room = $1', [`buddy:${uid}:${buddyName}`]);

        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

export default router;
