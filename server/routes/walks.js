import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM walks ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const uid = req.auth.payload.sub;
        const { title, from_location, to_location, time, distance, night_safe, avatars } = req.body;
        const avatarList = Array.isArray(avatars) ? avatars : [];

        const { rows } = await pool.query(
            `INSERT INTO walks (title, from_location, to_location, time, distance, buddies, night_safe, avatars, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
             RETURNING *`,
            [title, from_location, to_location, time, distance, avatarList.length || 1, !!night_safe, avatarList, uid]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// Used for join/leave: updates the buddy count and avatar list.
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { buddies, avatars } = req.body;

        const { rows } = await pool.query(
            `UPDATE walks SET
                buddies = COALESCE($2, buddies),
                avatars = COALESCE($3, avatars)
             WHERE id = $1
             RETURNING *`,
            [id, buddies, avatars]
        );

        if (!rows.length) return res.status(404).json({ error: 'Walk not found' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

export default router;
