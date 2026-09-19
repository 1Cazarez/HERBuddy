-- Herbuddy schema for TigerData / Postgres.
-- Run once against your database, e.g.:
--   psql "$DATABASE_URL" -f schema.sql

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Auth0 'sub' claim
    name TEXT NOT NULL DEFAULT 'New Walker',
    email TEXT,
    campus TEXT DEFAULT 'Main Quad Campus',
    contact TEXT DEFAULT 'Sarah Rivera (Mom) - 555-0192',
    step_goal INTEGER NOT NULL DEFAULT 10000,
    avatar TEXT NOT NULL DEFAULT '🦊',
    steps INTEGER NOT NULL DEFAULT 6420,
    active_minutes INTEGER NOT NULL DEFAULT 38,
    weekly_distance NUMERIC NOT NULL DEFAULT 14.8,
    completed_errands INTEGER NOT NULL DEFAULT 9,
    year TEXT,
    major TEXT,
    interests TEXT[] NOT NULL DEFAULT '{}',
    clubs TEXT[] NOT NULL DEFAULT '{}',
    events TEXT[] NOT NULL DEFAULT '{}',
    zone TEXT,
    walking_style TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Buddy-match profile fields, added after the initial launch — safe to
-- re-run against a database that already has the users table from before.
ALTER TABLE users ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS major TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS interests TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS clubs TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS events TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS zone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS walking_style TEXT;

CREATE TABLE IF NOT EXISTS walks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    time TEXT,
    distance TEXT,
    buddies INTEGER NOT NULL DEFAULT 1,
    night_safe BOOLEAN NOT NULL DEFAULT false,
    avatars TEXT[] NOT NULL DEFAULT '{}',
    created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS errands (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    requester_emoji TEXT,
    requester TEXT,
    reward TEXT NOT NULL DEFAULT '+50 pts',
    status TEXT NOT NULL DEFAULT 'Pending',
    created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    room TEXT NOT NULL DEFAULT 'main-quad',
    uid TEXT REFERENCES users(id) ON DELETE SET NULL,
    name TEXT,
    avatar TEXT,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_messages_room_created_at_idx ON chat_messages (room, created_at);

-- Buddy Match's matched buddies. The buddy "profiles" themselves are still
-- a hardcoded demo list on the frontend (not real other users), so this
-- just tracks which of those demo names each real user has matched with —
-- enough to persist the match + let their 1:1 chat thread survive reloads.
CREATE TABLE IF NOT EXISTS matched_buddies (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    buddy_name TEXT NOT NULL,
    matched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, buddy_name)
);

-- Real-user friendships (separate from Buddy Match, which matches against
-- a hardcoded demo list). Stored as one row per direction so "my friends"
-- is a plain WHERE user_id = $1 with no OR/self-join needed.
CREATE TABLE IF NOT EXISTS friends (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friend_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, friend_id)
);

-- Persists each walk a user starts so friends can see live status (walking
-- now / overdue / not walking) rather than that state living only in the
-- walker's own browser tab. expected_arrival_at is started_at + the walk's
-- alert-timeout minutes; a session past that with arrived_at still NULL is
-- "overdue" — the trigger for a friend's Check In nudge.
CREATE TABLE IF NOT EXISTS walk_sessions (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expected_arrival_at TIMESTAMPTZ NOT NULL,
    arrived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS walk_sessions_user_id_started_at_idx ON walk_sessions (user_id, started_at DESC);

-- Seed demo data so the app has something to show right after setup.
-- Skipped automatically once real rows exist.
INSERT INTO walks (title, from_location, to_location, time, distance, buddies, night_safe, avatars)
SELECT * FROM (VALUES
    ('Student Center → Library', 'Student Center', 'Library', '3:30 PM', '1.2 mi', 3, true, ARRAY['👩🏼','👩🏻','👩🏾']),
    ('North Campus Quad Loop', 'Quad Plaza', 'Science Hall', '4:15 PM', '0.8 mi', 2, true, ARRAY['👩‍🦱','👩‍🦰']),
    ('West Dorm Stroll', 'West Housing', 'Dining Hall', '5:00 PM', '1.5 mi', 4, false, ARRAY['👩🏽','👩🏼','👩🏻','👩🏾'])
) AS seed(title, from_location, to_location, time, distance, buddies, night_safe, avatars)
WHERE NOT EXISTS (SELECT 1 FROM walks);

INSERT INTO errands (title, from_location, to_location, requester_emoji, requester, reward, status)
SELECT * FROM (VALUES
    ('Library Printouts Dropoff', 'Student Center', 'Library', '👩🏼', 'Campus Buddy', '+50 pts', 'Pending'),
    ('Grab Iced Coffee from Cafe', 'Student Center', 'Science Hall', '👩‍🦱', 'Campus Buddy', '+40 pts', 'Pending')
) AS seed(title, from_location, to_location, requester_emoji, requester, reward, status)
WHERE NOT EXISTS (SELECT 1 FROM errands);
