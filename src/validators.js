const { validate, ValidationError, Joi } = require('express-validation');

const loginValidation = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),
};

const createUserValidation = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required()
  }),
};

const refreshTokenValidation = {
  body: Joi.object({
    refreshToken: Joi.string().required()
  }),
};

module.exports = {
  loginValidation,
  createUserValidation,
  refreshTokenValidation
};