const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('test user API', () => {
  beforeEach(helper.resetDb)

  describe('GET /api/users', () => {
    test('users are returned as json', async () => {
      (await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/))
    })

    test('the number of returned users is correct', async () => {
      const response = await api.get('/api/users')
      assert.strictEqual(response.body.length, helper.initialUsers.length)
    })

    test('all users are returned', async () => {
      const response = await api.get('/api/users')
      const usernames = response.body.map(e => e.username)
      for (const user of helper.initialUsers) {
        assert(usernames.includes(user.username))
      }
    })

    test('the users passwordHash (and password) are not returned', async () => {
      const response = await api.get('/api/users')
      const user = response.body[0]
      assert.strictEqual(user.passwordHash, undefined)
      assert.strictEqual(user.password, undefined) //shouldn't even be saved in the DB
    })

    test('the users blogs are populated', async () => {
      const response = await api.get('/api/users')
      const user = response.body.find(user => user.username === helper.initialUsers[1].username)
      assert.strictEqual(user.blogs.length, helper.initialUsers[1].blogs.length)
      assert.deepStrictEqual(
        user.blogs.map(blog => blog.id),
        helper.initialUsers[1].blogs
      )
    })
  })

  describe('POST /api/users', () => {
    test('a new user can be added', async () => {
      const newUser = {
        username: 'new_user',
        name: 'New User',
        password: 'secure password'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)

      assert(usersAtEnd.find(user => user.username === newUser.username))
    })

    test('a new user without username does not get added', async () => {
      const newUser = {
        name: 'New User',
        password: 'secure password'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('a new user without password does not get added', async () => {
      const newUser = {
        username: 'new_user',
        name: 'New User',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('a new user with a too short username does not get added', async () => {
      const newUser = {
        username: 'nu',
        name: 'New User',
        password: 'secure password'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('a new user with a too short password does not get added', async () => {
      const newUser = {
        username: 'new_user',
        name: 'New User',
        password: 'pw'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('a new user with a duplicate username does not get added', async () => {
      const newUser = {
        username: helper.initialUsers[0].username,
        name: 'New User',
        password: 'pw'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })
  })

  describe('POST /api/login', () => {
    test('a user can login', async () => {
      const user = {
        username: helper.initialUsers[0].username,
        password: helper.initialUsers[0].password
      }

      await api
        .post('/api/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('the returned token is valid', async () => {
      const user = {
        username: helper.initialUsers[0].username,
        password: helper.initialUsers[0].password
      }

      const response = await api
        .post('/api/login')
        .send(user)
        .expect(200)

      const decodedToken = jwt.verify(response.body.token, process.env.SECRET)
      assert.strictEqual(decodedToken.username, helper.initialUsers[0].username)
    })

    test('a new user can login', async () => {
      const newUser = {
        username: 'new_user',
        password: 'secure password'
      }

      await api
        .post('/api/users')
        .send(newUser)

      await api
        .post('/api/login')
        .send(newUser)
        .expect(200)
    })

    test('a user can\'t login with a wrong password', async () => {
      const user = {
        username: helper.initialUsers[0].username,
        password: 'poison' + helper.initialUsers[0].password
      }

      await api
        .post('/api/login')
        .send(user)
        .expect(401)
    })

    test('a user can\'t login without a password', async () => {
      const user = {
        username: helper.initialUsers[0].username
      }

      await api
        .post('/api/login')
        .send(user)
        .expect(401)

    })

    test('a non-existing user can\'t login', async () => {
      const user = {
        username: 'new_user',
        password: 'secure_password'
      }

      await api
        .post('/api/login')
        .send(user)
        .expect(401)
    })

    test('a user can\'t login without providing a username', async () => {
      const user = {
        password: helper.initialUsers[0].password
      }

      await api
        .post('/api/login')
        .send(user)
        .expect(401)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})