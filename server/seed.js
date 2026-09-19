// Convenience runner for schema.sql, for anyone without the psql CLI handy:
//   npm run seed   (from inside server/)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

try {
    await pool.query(sql);
    console.log('Herbuddy: schema applied and demo data seeded.');
} catch (err) {
    console.error('Herbuddy: failed to apply schema.sql', err);
    process.exitCode = 1;
} finally {
    await pool.end();
}
