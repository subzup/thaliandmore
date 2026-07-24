// Postgres connection pool (Neon or any standard Postgres). Requires
// DATABASE_URL to be set; see db/schema.sql for the table definitions and
// db/seed.js for the initial cafeteria/menu data.
const { Pool } = require('pg');

let pool = null;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. The corporate ordering system needs a Postgres database. See DEPLOY.md.');
  }
  if (!pool) {
    // Local/Docker Postgres used for development typically has no SSL
    // listener at all, while hosted providers like Neon require it, so this
    // is only enabled for non-local connection strings.
    var isLocal = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}

function query(text, params) {
  return getPool().query(text, params);
}

module.exports = { getPool, query };
