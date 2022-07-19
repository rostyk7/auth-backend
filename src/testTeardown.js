const pool = require('./db/pools');

module.exports = (async () => {
  await pool.end();
});