const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const pool = require('../db/pools');
const { createAccessToken } = require('../utils/tokens');

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  const tokenHeader = req.headers['authorization'];
  if (!tokenHeader) {
    return res
      .status(401)
      .json({
        message: 'Not Authenticated'
      })
  }
  const [_, token] = tokenHeader.split(' ');

  try {
    await jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true
    });
  } catch(err) {
    return res
      .status(401)
      .json({
        message: 'Invalid refresh or access token'
      });
  }

  const { rows } = await pool.query(`
    SELECT id, username
    FROM users
    WHERE refresh_token = $1 
  `, [refreshToken]);

  if (rows.length === 0) {
    return res
      .status(401)
      .json({
        message: 'Invalid refresh or access token'
      });
  }

  const [user] = rows;

  const newRefreshToken = uuid();

  pool.query(`
    UPDATE users
    SET refresh_token = $1
    WHERE id = $2 
  `, [newRefreshToken, user.id]);

  res
    .status(202)
    .json({
      accessToken: await createAccessToken(user),
      refreshToken: newRefreshToken
    });
};

module.exports = {
  refreshToken
};