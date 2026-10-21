const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'migrations');

/**
 * Applies every migrations/*.sql (name order) exactly once, each in a transaction.
 * Throws an Error naming the failed migration.
 * @param {{connect: Function, query: Function}} db pg Pool (or compatible)
 * @param {string} [dir]
 * @returns {Promise<string[]>} names applied in this run
 */
async function runMigrations(db, dir = MIGRATIONS_DIR) {
  await db.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  const done = new Set((await db.query('SELECT name FROM schema_migrations')).rows.map((r) => r.name));
  const applied = [];

  for (const file of files) {
    if (done.has(file)) continue;
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
      await client.query('COMMIT');
      applied.push(file);
      logger.info(`Migration applied: ${file}`);
    } catch (err) {
      try { await client.query('ROLLBACK'); } catch (_) { /* ignore */ }
      const e = new Error(`Migration failed: ${file} - ${err.message}`);
      e.migration = file;
      e.cause = err;
      throw e;
    } finally {
      client.release();
    }
  }
  return applied;
}

module.exports = { runMigrations, MIGRATIONS_DIR };
