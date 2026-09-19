import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const uid = req.auth.payload.sub;
        const { origin, destination, alertMinutes } = req.body;
        if (!origin || !destination) {
            return res.status(400).json({ error: 'origin and destination are required' });
        }
        const minutes = Number.isFinite(Number(alertMinutes)) ? Number(alertMinutes) : 30;

        const { rows } = await pool.query(
            `INSERT INTO walk_sessions (user_id, origin, destination, expected_arrival_at)
             VALUES ($1, $2, $3, now() + ($4 || ' minutes')::interval)
             RETURNING *`,
            [uid, origin, destination, minutes]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const uid = req.auth.payload.sub;
        const { id } = req.params;

        const { rows } = await pool.query(
            `UPDATE walk_sessions SET arrived_at = now()
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [id, uid]
        );
        if (!rows.length) return res.status(404).json({ error: 'Walk session not found' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

export default router;
