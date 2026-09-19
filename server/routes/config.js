import { Router } from 'express';

const router = Router();

// Public (no auth) — the frontend needs this before a user is necessarily
// logged in, and a Maps JS API key is inherently visible in the browser
// once loaded anyway. Real protection is the HTTP-referrer restriction set
// on the key in Google Cloud Console, not hiding this endpoint.
router.get('/', (req, res) => {
    res.json({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || null
    });
});

export default router;
