const pool = require('../db/pools');
const bcrypt = require('bcryptjs');
const { createAccessToken } = require('../utils/tokens');

const login = async (req, res) => {
  const { username, password } = req.body;

  const { rows } = await pool.query(`
    SELECT id, username, firstname, lastname, password, refresh_token
    FROM users
    WHERE username = $1
  `, [username]); 

  if (rows.length === 0) {
    return res
      .status(401)
      .json({
        message: 'Invalid username or password'
      });
  }

  const [user] = rows;

  const result = await bcrypt.compare(password, user.password);

  if (!result) {
    return res
    .status(401)
    .json({
      message: 'Invalid username or password'
    });
  }

  res.json({
    accessToken: await createAccessToken(user),
    refreshToken: user.refresh_token,
    success: true
  });
};

module.exports = {
  login
};