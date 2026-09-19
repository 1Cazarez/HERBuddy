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
cp .env.example .env   # fill in DATABASE_URL, AUTH0_DOMAIN, AUTH0_AUDIENCE
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
2. **Applications** → create a **Single Page Application** — this gives you
   the `AUTH0_DOMAIN` and a Client ID
   - Under its settings, set **Allowed Callback URLs**, **Allowed Logout
     URLs**, and **Allowed Web Origins** to wherever the frontend is served
     (e.g. `http://localhost:8934`)
3. **Applications → APIs** → create an API — the **Identifier** you give it
   is `AUTH0_AUDIENCE`
4. Fill in `server/.env`: `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`
5. Fill in `public/js/api-config.js`: `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`
   (from the SPA app), `AUTH0_AUDIENCE` (same identifier as above), and
   `API_BASE_URL` (where `server/` is reachable, e.g.
   `http://localhost:4000/api`)

Once both are filled in, the app automatically:
- Redirects to Auth0's Universal Login instead of the name-only form
- Creates a `users` row on first login and syncs profile edits + post-walk
  stats to it
- Polls chat messages and shared `walks`/`errands` from Postgres

If the API is unreachable, each feature falls back to local mock data so a
demo never breaks mid-presentation.

## Deploying

- Frontend: any static host (Netlify, Vercel, GitHub Pages, etc.) — just
  point it at `public/`
- Backend: any Node host (Render, Railway, Fly.io, a VM) — set the same env
  vars as `server/.env.example` and run `npm start`
