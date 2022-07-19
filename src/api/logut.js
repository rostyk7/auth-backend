const { v4: uuid } = require('uuid');
const pool = require('../db/pools');

const logout = async (req, res) => {
  const newRefreshToken = uuid();

  pool.query(`
    UPDATE users
    SET refresh_token = $1
    WHERE id = $2 
  `, [newRefreshToken, res.locals.user.id]);

  res
    .status(202)
    .json({
      success: true
    });
};

module.exports = {
  logout
};