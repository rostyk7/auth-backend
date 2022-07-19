
const pool = require('../db/pools');
const { faker } = require('@faker-js/faker');
const { Api } = require('./helpers/api');
const { generateUsername } = require('./helpers/data');

describe('create user', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM users');
  });

  it('should not be able to login with incorrect access token', async () => {
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
    await Api.getProfile(401);
  });

  it('should be able to login with correct credentials', async () => {
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
    Api.setToken(accessToken);
    const { body: { firstName, lastName, username: storedUsername } } = await Api.getProfile();
    expect(firstName).toBe(firstname);
    expect(lastName).toBe(lastname);
    expect(storedUsername).toBe(username);
  });

  it('should not be able to create an account with existing username', async () => {
    const username = generateUsername();
    const password = faker.internet.password();
    await Api.createUser({
      username,
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password
    });  
    await Api.createUser({
      username,
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password
    }, 400);
  });

  it('shouldn`t be able to login with incorrect username', async () => {
    const username = generateUsername();
    const password = faker.internet.password();
    await Api.createUser({
      username,
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password
    });  
    await Api.login({
      username: faker.internet.userName(),
      password
    }, 401);
  });

  it('shouldn`t be able to login with incorrect password', async () => {
    const username = generateUsername();
    const password = faker.internet.password();
    await Api.createUser({
      username,
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password
    });
    await Api.login({
      username,
      password: faker.internet.password()
    }, 401);
  });
});