
const pool = require('../db/pools');
const { faker } = require('@faker-js/faker');
const { Api } = require('./helpers/api');
const { generateUsername } = require('./helpers/data');
const { createAccessTokenWithExpiration } = require('../utils/tokens');

describe('refresh user', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM users');
  });

  it('should be able to refresh token', async () => {
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
    const { 
      body: { 
        accessToken: newAccessToken
      }
    } = await Api.refreshToken(refreshToken);
    Api.setToken(newAccessToken);
    const { body: { firstName, lastName, username: storedUsername } } = await Api.getProfile();
    expect(firstName).toBe(firstname);
    expect(lastName).toBe(lastname);
    expect(storedUsername).toBe(username);
  });

  it('should be able to login with mixed access token', async () => {
    const username = generateUsername();
    const password = faker.internet.password();
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    const { body: { id }} = await Api.createUser({
      username,
      firstname,
      lastname,
      password
    });  
    const accessToken = await createAccessTokenWithExpiration({ id, username }, '1m'); 
    Api.setToken(accessToken);
    const { body: { firstName, lastName, username: storedUsername } } = await Api.getProfile();
    expect(firstName).toBe(firstname);
    expect(lastName).toBe(lastname);
    expect(storedUsername).toBe(username);
  });

  it('shouldn`t be able to login with expired access token', async () => {
    const username = generateUsername();
    const password = faker.internet.password();
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    const { body: { id }} = await Api.createUser({
      username,
      firstname,
      lastname,
      password
    });  
    const accessToken = await createAccessTokenWithExpiration({ id, username }, '-1m'); 
    Api.setToken(accessToken);
    await Api.getProfile(401);
  });

  it('should be able to refresh token with expired access token', async () => {
    const username = generateUsername();
    const password = faker.internet.password();
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    const { body: { id }} = await Api.createUser({
      username,
      firstname,
      lastname,
      password
    });  
    const accessToken = await createAccessTokenWithExpiration({ id, username }, '-1m'); 
    const { body: { refreshToken } } = await Api.login({
      username,
      password
    });
    Api.setToken(accessToken);
    const { 
      body: { 
        accessToken: newAccessToken
      }
    } = await Api.refreshToken(refreshToken);
    Api.setToken(newAccessToken);
    const { body: { firstName, lastName, username: storedUsername } } = await Api.getProfile();
    expect(firstName).toBe(firstname);
    expect(lastName).toBe(lastname);
    expect(storedUsername).toBe(username);
  });

  it('shouldn`t be able to refresh token when refresh token is not valid', async () => {
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
    await Api.refreshToken(refreshToken + '2', 401);
  });

  it('shouldn`t be able to refresh token when access token is invalid', async () => {
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
    Api.setToken(accessToken + '2');
    await Api.refreshToken(refreshToken, 401);
  });  
});