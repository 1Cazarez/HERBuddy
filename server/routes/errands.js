import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM errands ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const uid = req.auth.payload.sub;
        const { title, from_location, to_location, requester_emoji, requester, reward } = req.body;

        const { rows } = await pool.query(
            `INSERT INTO errands (title, from_location, to_location, requester_emoji, requester, reward, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             RETURNING *`,
            [title, from_location, to_location, requester_emoji, requester, reward || '+50 pts', uid]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { rows } = await pool.query(
            `UPDATE errands SET status = COALESCE($2, status) WHERE id = $1 RETURNING *`,
            [id, status]
        );

        if (!rows.length) return res.status(404).json({ error: 'Errand not found' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

export default router;
