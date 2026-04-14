const fs = require('fs');
const path = require('path');
const pool = require('./db');

(async () => {
  try {
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(sql);
    console.log('Database schema initialized.');
  } catch (error) {
    console.error('Schema initialization failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
