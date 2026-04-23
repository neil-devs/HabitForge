const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function runSingleMigration(filename) {
  const client = await pool.connect();
  try {
    console.log(`Running single migration: ${filename}`);
    await client.query('BEGIN');
    const sql = fs.readFileSync(path.join(__dirname, 'migrations', filename), 'utf-8');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migration completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error running migration:', err);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

runSingleMigration('017_create_ai_insights.sql');
