import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const missing = ['DATABASE_URL', 'AUTH0_DOMAIN', 'AUTH0_AUDIENCE'].filter((key) => !process.env[key]);
if (missing.length) {
    console.error(
        `Herbuddy API: missing required env var(s): ${missing.join(', ')}.\n` +
        'Copy server/.env.example to server/.env and fill them in before starting the server.\n' +
        '(The frontend runs fine without this — it just stays in local demo mode.)'
    );
    process.exit(1);
}

const { checkJwt } = await import('./auth.js');
const { default: meRouter } = await import('./routes/me.js');
const { default: walksRouter } = await import('./routes/walks.js');
const { default: errandsRouter } = await import('./routes/errands.js');
const { default: chatRouter } = await import('./routes/chat.js');
const { default: configRouter } = await import('./routes/config.js');
const { default: matchesRouter } = await import('./routes/matches.js');
const { default: friendsRouter } = await import('./routes/friends.js');
const { default: walkSessionsRouter } = await import('./routes/walk-sessions.js');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

// Public — no JWT check. See routes/config.js for why.
app.use('/api/config', configRouter);

app.use('/api/me', checkJwt, meRouter);
app.use('/api/walks', checkJwt, walksRouter);
app.use('/api/errands', checkJwt, errandsRouter);
app.use('/api/chat', checkJwt, chatRouter);
app.use('/api/matches', checkJwt, matchesRouter);
app.use('/api/friends', checkJwt, friendsRouter);
app.use('/api/walk-sessions', checkJwt, walkSessionsRouter);

// Keep this last: express-oauth2-jwt-bearer throws an UnauthorizedError that
// needs to be turned into a clean 401 instead of a stack trace; our own
// routes may also throw with a deliberate .status (e.g. 403 for a buddy
// room that isn't the caller's).
app.use((err, req, res, next) => {
    if (err.status === 401) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (err.status && err.status < 500) {
        return res.status(err.status).json({ error: err.message || 'Request error' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Herbuddy API listening on :${port}`));
