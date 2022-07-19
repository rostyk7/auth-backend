
const pool = require('../db/pools');
const { faker } = require('@faker-js/faker');
const { Api } = require('./helpers/api');
const { generateUsername } = require('./helpers/data');
const { createAccessTokenWithExpiration } = require('../utils/tokens');

describe('logout user', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM users');
  });

  it('should not be able to refresh after logout with the same token', async () => {
    const username = generateUsername();
    const password = faker.internet.password();
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    await Api.createUser({
      username,
      firstname,
      lastname,
      password
    });  
    const { body: { accessToken, refreshToken } } = await Api.login({
      username,
      password
    });
    Api.setToken(accessToken);
    await Api.logout();
    await Api.refreshToken(refreshToken, 401);
  });

  it('should not be able to logout when access token is invalid', async () => {
    const username = generateUsername();
    const password = faker.internet.password();
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    await Api.createUser({
      username,
      firstname,
      lastname,
      password
    });  
    const { body: { accessToken } } = await Api.login({
      username,
      password
    });
    Api.setToken(accessToken + '2');
    await Api.logout(401);
  });
});