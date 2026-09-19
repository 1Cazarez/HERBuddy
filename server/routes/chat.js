import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();
const ROOM = 'main-quad';

// Herbuddy currently has one shared campus chat room. The frontend polls
// this endpoint every few seconds rather than holding a live socket open —
// simple and reliable for a hackathon-scale app.
router.get('/messages', async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM chat_messages WHERE room = $1 ORDER BY created_at ASC LIMIT 100',
            [ROOM]
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

router.post('/messages', async (req, res, next) => {
    try {
        const uid = req.auth.payload.sub;
        const { text, name, avatar } = req.body;
        if (!text || !text.trim()) return res.status(400).json({ error: 'text is required' });

        const { rows } = await pool.query(
            `INSERT INTO chat_messages (room, uid, name, avatar, text) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [ROOM, uid, name, avatar, text.trim()]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

export default router;
