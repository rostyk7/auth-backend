const supertest = require('supertest');
const app = require('../../server');

class Api {
  constructor(app) {
    this.app = app;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async createUser({
    username,
    firstname,
    lastname,
    password
  }, expectedCode = 200) {
    return supertest(this.app)
    .post('/api/create_user')
    .send({
      username,
      firstname,
      lastname,
      password
    })
    .expect(expectedCode)
  }

  async login({
    username,
    password
  }, expectedCode = 200) {
    return supertest(this.app)
      .post('/api/login')
      .send({
        username,
        password
      })
      .expect(expectedCode)
  }

  async refreshToken(refreshToken, expectedCode = 202) {
    return supertest(this.app)
      .post('/api/refresh_token')
      .set({
        'Authorization': this.token
      })
      .send({ refreshToken })
      .expect(expectedCode)
  }

  async logout(expectedCode = 202) {
    return supertest(this.app)
      .post('/api/logout')
      .set({
        'Authorization': this.token
      })
      .expect(expectedCode)
  }

  async getProfile(expectedCode = 200) {
    return supertest(this.app)
      .get('/api/profile')
      .set({
        'Authorization': this.token
      })
      .expect(expectedCode)
  }
}

module.exports = {
  Api: new Api(app)
};