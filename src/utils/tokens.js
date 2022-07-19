const jwt = require('jsonwebtoken');

const createAccessTokenWithExpiration = (user, expiresIn) => {
  const accessToken = jwt.sign({
    id: user.id,
    username: user.username
  }, process.env.JWT_SECRET, {
    expiresIn
  });
  return `Bearer ${accessToken}`;
};

const createAccessToken = user => createAccessTokenWithExpiration(user, '15s');

module.exports = {
  createAccessToken,
  createAccessTokenWithExpiration
};