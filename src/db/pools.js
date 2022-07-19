const { Pool } = require('pg');

const credentials = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const pool = new Pool(credentials);

const prepareDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      password TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      created TIMESTAMP DEFAULT NOW(),
      UNIQUE(username)
    )
  `);
};

if (process.env.NODE_ENV !== 'test') {
  console.log('Connecting to the database...');

  pool.connect(async (err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    console.log('Database connection is successfully established!');
    await prepareDb();
  })
}

module.exports = pool;
module.exports.prepareDb = prepareDb;