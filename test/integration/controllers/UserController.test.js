var supertest = require('supertest');
var assert = require('assert');

describe('UserController.register', async function () {
  describe('/api/v1/user/register', function () {
    it('should register a new user', async function () {
      const userRegister = {
        "email": "user@example.com1",
        "password": "password",
        "confirmPassword": "password",
        "name": "user"
      }

      await supertest(sails.hooks.http.app)
        .post(`/api/v1/user/register`)
        .send(userRegister)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res) => {
          assert.strictEqual(res.body.success, true)
          assert.strictEqual(res.body.message, `New user created. Email: user@example.com1`)
        })
    });
  });
});


describe('UserController.login', async function () {
  describe('/api/v1/user/login', function () {
    it('should login a user', async function () {
      const userLogin = {
        "email": "user@example.com1",
        "password": "password",
      }

      await supertest(sails.hooks.http.app)
        .post(`/api/v1/user/login`)
        .send(userLogin)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res) => {
          assert.strictEqual(res.body.success, true)
          assert.strictEqual(res.body.message, `User logged in successfully. Email: user@example.com1`)
        })
    })
  });
});
