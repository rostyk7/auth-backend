const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { validate } = require('express-validation');
const { createUser } = require('./api/create_user');
const { login } = require('./api/login_user');
const { refreshToken } = require('./api/refresh_token');
const asyncHandler = require('./utils/async_handler');
const jwtMiddleware = require('./middlewares/jwtMiddleware');
const getProfile = require('./api/get_profile');
const { loginValidation, createUserValidation, refreshTokenValidation } = require('./validators');
const { logout } = require('./api/logut');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/api/create_user', validate(createUserValidation), asyncHandler(createUser));
app.post('/api/login', validate(loginValidation), asyncHandler(login));
app.post('/api/refresh_token', validate(refreshTokenValidation), asyncHandler(refreshToken));

app.use(jwtMiddleware);

app.post('/api/logout', asyncHandler(logout));
app.get('/api/profile', asyncHandler(getProfile));

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json(err.details);
});

module.exports = app;