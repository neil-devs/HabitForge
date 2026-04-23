const { Pool } = require('pg');

// Hardcoded DB configuration as per project requirements
const DB_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'habitforge_db',
  user: 'habitforge_user',
  password: 'HabitForge_DB_P@ss2026!',
  max: 20,                // pool max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(DB_CONFIG);

// Test connection on startup
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};
