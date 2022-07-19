const pool = require('../db/pools');

const getProfile = async (req, res) => {
  const { rows } = await pool.query(`
    SELECT id, username, firstname, lastname
    FROM users
    WHERE id = $1 
  `, [res.locals.user.id]);
  
  const [user] = rows;

  res.json({
    id: user.id,
    firstName: user.firstname,
    lastName: user.lastname,
    username: user.username
  });
};

module.exports = getProfile;