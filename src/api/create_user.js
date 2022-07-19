const bcrypt = require('bcryptjs');
const pool = require('../db/pools');
const { v4: uuid } = require('uuid');

const createUser = async (req, res) => {
  const { username, firstname, lastname, password } = req.body;

  const { rows } = await pool.query(`
    SELECT id
    FROM users
    WHERE username = $1
  `, [username]);
  
  if (rows.length !== 0) {
    return res
      .status(400)
      .json({
        message: 'User with such username already exists'
      })
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { rows: [{ id: insertedId }] } = await pool.query(`
    INSERT INTO users (username, firstname, lastname, password, refresh_token)
    VALUES($1, $2, $3, $4, $5)
    RETURNING id
  `, [username, firstname, lastname, hashedPassword, uuid()]);

  res.json({
    id: insertedId,
    success: true
  })
};

module.exports = {
  createUser
};