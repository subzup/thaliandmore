// Run once against a fresh database: `npm run db:migrate`
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { getPool } = require('../config/db');

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
  const pool = getPool();
  await pool.query(sql);
  console.log('Schema migrated successfully.');
  await pool.end();
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
