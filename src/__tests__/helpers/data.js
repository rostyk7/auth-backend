const { faker } = require('@faker-js/faker');
const { v4: uuid } = require('uuid');

const generateUsername = () => `${faker.internet.userName()}-${uuid()}`;

module.exports = {
  generateUsername
};