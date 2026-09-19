import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// Returns the signed-in user's profile row, creating it on first login
// using whatever name/email Auth0 gave us in the token.
router.get('/', async (req, res, next) => {
    try {
        const uid = req.auth.payload.sub;
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [uid]);
        if (rows.length) return res.json(rows[0]);

        const claims = req.auth.payload;
        const name = claims.name || claims.nickname || 'New Walker';
        const email = claims.email || null;

        const { rows: created } = await pool.query(
            `INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING *`,
            [uid, name, email]
        );
        res.status(201).json(created[0]);
    } catch (err) {
        next(err);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const uid = req.auth.payload.sub;
        const {
            name, email, campus, contact,
            step_goal, avatar, steps, active_minutes, weekly_distance, completed_errands,
            year, major, interests, clubs, events, zone, walking_style
        } = req.body;

        const { rows } = await pool.query(
            `UPDATE users SET
                name = COALESCE($2, name),
                email = COALESCE($3, email),
                campus = COALESCE($4, campus),
                contact = COALESCE($5, contact),
                step_goal = COALESCE($6, step_goal),
                avatar = COALESCE($7, avatar),
                steps = COALESCE($8, steps),
                active_minutes = COALESCE($9, active_minutes),
                weekly_distance = COALESCE($10, weekly_distance),
                completed_errands = COALESCE($11, completed_errands),
                year = COALESCE($12, year),
                major = COALESCE($13, major),
                interests = COALESCE($14, interests),
                clubs = COALESCE($15, clubs),
                events = COALESCE($16, events),
                zone = COALESCE($17, zone),
                walking_style = COALESCE($18, walking_style)
             WHERE id = $1
             RETURNING *`,
            [uid, name, email, campus, contact, step_goal, avatar, steps, active_minutes, weekly_distance, completed_errands,
                year, major, interests, clubs, events, zone, walking_style]
        );

        if (!rows.length) return res.status(404).json({ error: 'User not found' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

export default router;
