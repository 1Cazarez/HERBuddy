import pg from 'pg';
import { parse as parsePgConnectionString } from 'pg-connection-string';
import 'dotenv/config';

const rawConnectionString = process.env.DATABASE_URL;

if (!rawConnectionString) {
    console.warn('Herbuddy API: DATABASE_URL is not set. Requests to the database will fail until server/.env is configured (see server/.env.example).');
}

let poolConfig = {};

if (rawConnectionString) {
    // Parse into discrete fields ourselves (with the same parser `pg` uses
    // internally) instead of passing `connectionString` straight to Pool.
    // pg's own ConnectionParameters re-parses `connectionString` and merges
    // it in LAST, silently overwriting any `ssl` option we pass alongside
    // it — so a straightforward `{ connectionString, ssl }` never actually
    // applies our ssl override. Discrete fields avoid that merge entirely.
    const parsed = parsePgConnectionString(rawConnectionString);
    poolConfig = {
        host: parsed.host,
        port: parsed.port ? Number(parsed.port) : undefined,
        user: parsed.user,
        password: parsed.password,
        database: parsed.database,
        // Encrypt the connection without strict chain verification. Needed
        // for TigerData: its intermediate cert isn't in every system's CA
        // bundle, which otherwise fails with SELF_SIGNED_CERT_IN_CHAIN.
        ssl: parsed.ssl ? { rejectUnauthorized: false } : undefined
    };
}

export const pool = new pg.Pool(poolConfig);
