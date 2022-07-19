const jwt = require('jsonwebtoken');

const jwtMiddleware = async (req, res, next) => {
  const tokenHeader = req.headers['authorization']
  if (!tokenHeader) {
    return res
      .status(401)
      .json({
        message: 'Not Authenticated'
      })
  }
  const [_, token] = tokenHeader.split(' ');
  try {
    const tokenData = await jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = {
      id: tokenData.id
    };
    next();
  } catch(e) {
    return res
      .status(401)
      .json({
        message: 'Not Authenticated'
      });
  }
};

module.exports = jwtMiddleware;