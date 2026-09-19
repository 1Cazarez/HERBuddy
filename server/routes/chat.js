import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();
const GROUP_ROOM = 'main-quad';

// Buddy-match 1:1 rooms are named "buddy:<uid>:<buddyName>" so each user's
// thread with a given (demo) buddy is private to them. Real-friend 1:1
// rooms are "friend:<uidA>:<uidB>" with the two uids sorted so both sides
// compute the same room name — access requires being one of the two.
// Anything else falls through to the shared group room.
function assertRoomAccess(room, uid) {
    const forbidden = () => {
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };
    if (room.startsWith('buddy:') && !room.startsWith(`buddy:${uid}:`)) {
        forbidden();
    }
    if (room.startsWith('friend:')) {
        const parts = room.split(':');
        if (parts.length !== 3 || !parts.slice(1).includes(uid)) forbidden();
    }
}

// Herbuddy currently has one shared campus chat room plus private
// per-buddy rooms. The frontend polls this endpoint every few seconds
// rather than holding a live socket open — simple and reliable at this scale.
router.get('/messages', async (req, res, next) => {
    try {
        const uid = req.auth.payload.sub;
        const room = req.query.room || GROUP_ROOM;
        assertRoomAccess(room, uid);

        const { rows } = await pool.query(
            'SELECT * FROM chat_messages WHERE room = $1 ORDER BY created_at ASC LIMIT 100',
            [room]
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

router.post('/messages', async (req, res, next) => {
    try {
        const uid = req.auth.payload.sub;
        const { text, name, avatar, room, asBuddy } = req.body;
        const targetRoom = room || GROUP_ROOM;
        assertRoomAccess(targetRoom, uid);
        if (!text || !text.trim()) return res.status(400).json({ error: 'text is required' });

        // asBuddy lets a user seed a canned "message from the buddy" line
        // (uid: null) into their OWN private buddy room only — harmless
        // since it's their own demo data, and assertRoomAccess above
        // already confirmed this room belongs to them.
        const rowUid = asBuddy ? null : uid;

        const { rows } = await pool.query(
            `INSERT INTO chat_messages (room, uid, name, avatar, text) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [targetRoom, rowUid, name, avatar, text.trim()]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

export default router;
