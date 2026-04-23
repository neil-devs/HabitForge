const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('Starting database migrations...');
    await client.query('BEGIN');

    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    for (const file of files) {
      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      await client.query(sql);
    }

    console.log('Migrations completed successfully.');

    console.log('Starting database seeding...');
    const seedsDir = path.join(__dirname, 'seeds');
    const seedFiles = fs.readdirSync(seedsDir).filter(f => f.endsWith('.sql')).sort();

    for (const file of seedFiles) {
      console.log(`Running seed: ${file}`);
      const sql = fs.readFileSync(path.join(seedsDir, file), 'utf-8');
      await client.query(sql);
    }

    console.log('Seeding completed successfully.');

    await client.query('COMMIT');
    console.log('All database operations finished.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error running migrations/seeds:', err);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

runMigrations();
