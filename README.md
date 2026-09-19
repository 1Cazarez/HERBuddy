# HerBody

Women-focused walking safety, matching, and wellness app for HackHERS 2026.

## Project structure

The frontend is a dependency-free static site (no build step) that renders
as a simulated phone screen with a tabbed Herbuddy app inside it. It's split
into small native Web Components — one per page/section — plus a handful of
JS modules for shared state and talking to the backend.

Persistence and auth are handled by a small Express API in `server/`,
backed by a **TigerData / Postgres** database, with **Auth0** doing login.

```
public/
  index.html               # shell: phone frame + <hb-*> component tags
  css/styles.css           # shared styles (Tailwind is loaded via CDN)
  js/
    api-config.js           # API base URL + Auth0 config (fill these in)
    auth0-client.js          # Auth0 SPA SDK wrapper (login/logout/token)
    api.js                    # fetch wrapper that attaches the Auth0 token
    state.js                   # in-memory app state / local mock data
    utils.js                    # toast, clock, escapeHtml helpers
    navigation.js                 # tab switching, launcher <-> app transitions
    auth.js                        # login flow (Auth0 or local demo mode)
    profile.js                      # profile sync/edit, PUT /api/me
    chat.js                          # chat tab, polls GET /api/chat/messages
    walks.js                          # find/create tabs, /api/walks
    errands.js                         # pickups tab, /api/errands
    sos.js                               # emergency SOS sound + toast
    main.js                               # wires everything together, boots the app
    components/                           # one file per page/section (login, each
                                           # tab, header, nav, toast, banners, modals)
server/
  index.js                # Express app, mounts routes behind Auth0 JWT check
  db.js                     # pg Pool connected to TigerData/Postgres
  auth.js                     # Auth0 access-token verification middleware
  schema.sql                   # tables + demo seed data
  seed.js                        # `npm run seed` runner for schema.sql
  routes/{me,walks,errands,chat}.js
```

Each page/tab on the frontend is a custom element (e.g. `<hb-tab-chat>`,
`<hb-tab-wellness>`) defined in `public/js/components/`. `main.js` registers
them and exposes the shared handler functions on `window` so the existing
`onclick`/`onsubmit` attributes keep working.

**Why a separate backend?** Postgres (unlike Firestore) has no
secure-from-the-browser client SDK — credentials can't be shipped to
frontend JS. `server/` is the thin API layer the static site talks to
instead. Auth0 verifies who's calling; Express does the querying.

Chat, walks, and errands update via short polling (every 3–4s) rather than
a live socket — simple and reliable at hackathon scale. See `chat.js` /
`walks.js` / `errands.js` if you want to swap in Postgres `LISTEN/NOTIFY` +
Server-Sent Events later for instant push updates.

## Running it locally

### Quick start (teammates — reuse the shared TigerData + Auth0 + Maps setup)

`public/js/api-config.js` already has the real `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`,
and `AUTH0_AUDIENCE` committed (these aren't secrets — they're meant to be
public, client-side values). To run the full app locally against the same
shared backend the live site uses:

1. **Get two values privately from Juan** (Discord/Slack DM — never put
   these in a commit or in this file): the TigerData `DATABASE_URL` and the
   `GOOGLE_MAPS_API_KEY`.
   - Heads up: the Maps key is currently restricted (by HTTP referrer, in
     Google Cloud Console) to `https://her-buddy.vercel.app` only, so maps
     will likely stay blank locally unless that gets updated to also allow
     `localhost` — everything else works fine either way.
2. `cd server && cp .env.example .env`, then fill in:
   ```
   DATABASE_URL=<the connection string Juan sent you>
   AUTH0_DOMAIN=dev-zkihg5tmwlk8og2v.us.auth0.com
   AUTH0_AUDIENCE=https://herbuddy-api
   GOOGLE_MAPS_API_KEY=<the key Juan sent you>
   CLIENT_ORIGIN=http://localhost:8934
   ```
   (`AUTH0_DOMAIN`/`AUTH0_AUDIENCE` are just copied from `api-config.js` —
   same values, not secret.)
3. `npm install` (from `server/`), then `npm run dev`
4. From the project root, serve the frontend **on port 8934 specifically**
   — that exact origin is what's registered in Auth0's Allowed Callback/
   Logout/Web Origin URLs, so a different port will fail to log in:
   ```bash
   npx serve public -l 8934
   ```
5. Open http://localhost:8934 and log in with your own email (or GSU
   email/Google) — it creates your own row in the shared database.

⚠️ **This is the same TigerData database the live site uses.** Chat
messages, walks, errands, and buddy matches you create locally are real
rows in the shared DB and will show up on `her-buddy.vercel.app` too (and
vice versa). Fine for testing together during the hackathon: just know
you're not sandboxed. If you want a fully isolated database instead, skip
to **Setting up TigerData** below and use your own service + your own
`server/.env`.

### From scratch (your own TigerData + Auth0 + Maps)

**1. Frontend** — serve `public/` over HTTP (module scripts don't work from
a `file://` URL):

```bash
npx serve public
# or
python3 -m http.server --directory public
```

**2. Backend** (only needed once you've set up TigerData + Auth0 below):

```bash
cd server
cp .env.example .env   # fill in DATABASE_URL, AUTH0_DOMAIN, AUTH0_AUDIENCE, GOOGLE_MAPS_API_KEY
npm install
npm run seed            # creates tables + demo walks/errands
npm run dev
```

Without the backend running (or without real config in
`public/js/api-config.js`), the app still works fully off local mock data,
with the original name-only login screen.

## Setting up TigerData (Postgres)

1. Create a service at https://console.cloud.tigerdata.com
2. Copy its connection string into `server/.env` as `DATABASE_URL`
3. From `server/`, run `npm run seed` (or `psql "$DATABASE_URL" -f schema.sql`)
   to create tables and seed demo walks/errands

## Setting up Auth0

1. Create a tenant at https://manage.auth0.com
2. **Applications → Applications → Create Application** → pick
   **Single Page Web Applications** specifically. ⚠️ This matters — a
   couple of hours of debugging tonight came from this exact step:
   - If the app ends up typed **Native** instead, login redirects work but
     the token exchange fails with `access_denied`. Fix: on the app's
     Settings page, change **Application Type** to **Single Page
     Application**, then re-save the callback/logout/origin URLs below.
   - Creating a **custom API** (step 3) auto-creates a *second*,
     unrelated application named **"\<API name\> (Test Application)"**,
     typed **Machine to Machine**. It's easy to grab its Client ID by
     mistake instead of your real SPA app's — if login fails with
     `unauthorized_client` or a token-exchange error, double check
     you're using the actual SPA app, not the Test Application.
3. On the SPA app's **Settings** tab, note the **Domain** and **Client ID**
   (these become `AUTH0_DOMAIN` / `AUTH0_CLIENT_ID` — not secrets, safe to
   commit in `api-config.js`). Set:
   - **Allowed Callback URLs**, **Allowed Logout URLs**: the site's root
     URL, e.g. `http://localhost:8934/` (note the trailing slash, no
     path) — the app always redirects to the bare origin, not
     `/index.html`, specifically to dodge a static-file-server gotcha
     where `/index.html` gets redirected to `/` and drops Auth0's
     `?code=&state=` query params in the process.
   - **Allowed Web Origins**: `http://localhost:8934` (no trailing slash)
   - Scroll to **Show Advanced Settings → Grant Types** and check
     **Authorization Code** and **Refresh Token**
4. **Applications → APIs → Create API** — the **Identifier** you type
   becomes `AUTH0_AUDIENCE` (also not secret), e.g. `https://herbuddy-api`.
   Leave JWT Profile / Signing Algorithm on their defaults.
5. Still on the SPA app (not the Test Application): its **API Access**
   tab (or the API's own **Machine to Machine Applications** /
   **Application Access** tab — same setting, different entry point) —
   authorize it for the API you just created.
6. Fill in `server/.env`: `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`
7. Fill in `public/js/api-config.js`: `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`
   (from the SPA app), `AUTH0_AUDIENCE` (same identifier as above)

Once both are filled in, the app automatically:
- Redirects to Auth0's Universal Login instead of the name-only form
- Creates a `users` row on first login, walks new users through a
  Year/Major onboarding step, and syncs profile edits + post-walk stats
- Polls chat messages and shared `walks`/`errands`/buddy matches from
  Postgres

If the API is unreachable, each feature falls back to local mock data so a
demo never breaks mid-presentation.

## Setting up Google Maps

The Find & Map tab uses the real Google Maps JavaScript API (campus
building markers) and, if enabled, the Directions API (real walking
routes/times — falls back to a straight-line estimate otherwise).

1. https://console.cloud.google.com → create a project (any Google
   account, doesn't need to be GSU) → requires billing enabled, but Maps'
   free monthly credit comfortably covers hackathon-scale usage
2. **APIs & Services → Library** → enable **Maps JavaScript API** and,
   for real walking directions, also **Directions API**
3. **APIs & Services → Credentials → Create Credentials → API Key**
4. Restrict it (click into the key):
   - **Application restrictions → HTTP referrers** → add your domain(s),
     e.g. `https://your-deployed-site.vercel.app/*` and
     `localhost:8934/*` (Google Cloud Console can be picky about
     `http://localhost` entries — try without the scheme, as shown, if
     it rejects `http://localhost:8934/*`)
   - **API restrictions** → restrict to **Maps JavaScript API** (and
     **Directions API** if you enabled it)
5. Put the key in `server/.env` as `GOOGLE_MAPS_API_KEY` — **never** in
   any file under `public/`. The frontend (`public/js/map.js`) fetches it
   at runtime from `GET /api/config` instead of it being hardcoded in
   source, so it can be rotated without a code change. (The key is still
   visible in the browser once loaded — that's unavoidable for any
   client-side Maps key. The HTTP-referrer restriction above is the real
   protection, not keeping it out of source.)

Without this configured, `GET /api/config` returns a null key and the map
area just stays blank — nothing else breaks.

## Deploying

The live app is already deployed and connected to GitHub for auto-deploy
on push — no manual deploy steps needed for normal changes:

- **Frontend**: https://her-buddy.vercel.app — Vercel, root directory
  `public`, no build command
- **Backend**: https://herbuddy.onrender.com — Render, root directory
  `server`, build `npm install`, start `npm start`

**Important workflow quirk:** both are connected to `1Cazarez/HERBuddy`
(a personal fork), not this repo, because Render/Vercel's GitHub App
couldn't be granted access to this org-owned repo. Both track that
fork's `main` branch specifically, which has branch protection (no
force-push, PRs only). So to actually ship a change to the live site:

1. Push your branch to `1Cazarez/HERBuddy` (ask Juan for push access, or
   push to your own fork of it and PR from there)
2. Open a PR into `1Cazarez/HERBuddy`'s `main` and merge it
3. Vercel + Render auto-redeploy within a minute or two

Pushing only to this repo's `main`/`juan-work` does **not** update the
live site by itself.

If you'd rather deploy your own separate instance instead of touching the
shared one: any static host works for the frontend (just point it at
`public/`), and any Node host works for the backend (Render, Railway,
Fly.io, a VM — set the same env vars as `server/.env.example` and run
`npm start`). You'd also want your own TigerData/Auth0/Maps setup per the
sections above rather than the shared ones, and remember to point
`public/js/api-config.js`'s `API_BASE_URL` at wherever your own backend
ends up.
