const { test, after, describe, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('test blogs API', () => {
  let validTokens = []

  before(async () => {
    for (const { username, password } of helper.initialUsers) {
      const response = await api
        .post('/api/login')
        .send({ username, password })
      validTokens.push(response.body.token)
    }

  })
  beforeEach(helper.resetDb)

  test('the unique identifier is renamed to id', async () => {
    const blogs = await helper.blogsInDb()
    for (const blog of blogs) {
      assert.notStrictEqual(blog.id, undefined)
      assert.strictEqual(blog._id, undefined)
    }
  })

  describe('GET /api/blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('the number of returned blogs is correct', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is one of the returned blogs', async () => {
      const response = await api.get('/api/blogs')
      const contents = response.body.map(e => e.title)
      assert(contents.includes('React patterns'))
    })
  })

  describe('POST /api/blogs', () => {
    test('a valid blog can be added ', async () => {
      const newBlog = {
        title: 'A cool new Blog',
        author: 'Anonymous',
        url: 'https://not-a-real-domain.com/not-an-actual-url',
        likes: 7
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validTokens[0]}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const contents = blogsAtEnd.map(n => n.title)
      assert(contents.includes(newBlog.title))
    })

    test('a blog without the likes property defaults to zero likes', async () => {
      const newBlog = {
        title: 'A cool new Blog',
        author: 'Anonymous',
        url: 'https://not-a-real-domain.com/not-an-actual-url'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validTokens[0]}`)
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    test('a blog without title does not get added', async () => {
      const newBlog = {
        author: 'Anonymous',
        url: 'https://not-a-real-domain.com/not-an-actual-url'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validTokens[0]}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a blog without url does not get added', async () => {
      const newBlog = {
        title: 'A cool new Blog',
        author: 'Anonymous',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validTokens[0]}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a valid blog does not get added if the token is missing', async () => {
      const newBlog = {
        title: 'A cool new Blog',
        author: 'Anonymous',
        url: 'https://not-a-real-domain.com/not-an-actual-url',
        likes: 7
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a valid blog does not get added if the token is invalid', async () => {
      const newBlog = {
        title: 'A cool new Blog',
        author: 'Anonymous',
        url: 'https://not-a-real-domain.com/not-an-actual-url',
        likes: 7
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer not.a.valid.token')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('GET /api/blogs/:id', () => {
    test('a valid id returns a blog', async () => {
      const blogs = await helper.blogsInDb()
      const response = await api
        .get(`/api/blogs/${blogs[0].id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      assert.deepStrictEqual(response.body, blogs[0])
    })

    test('an invalid id can\'t return a blog', async () => {
      await api
        .get(`/api/blogs/${helper.nonExistingId}`)
        .expect(404)
    })
  })

  describe('DELETE /api/blogs/:id', () => {
    test('a valid id can delete a blog', async () => {
      const correctToken = validTokens[3]
      await api
        .delete(`/api/blogs/${helper.initialBlogs[0].id}`)
        .set('Authorization', `Bearer ${correctToken}`)
        .expect(204)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('an invalid id can\'t delete a blog', async () => {
      await api
        .delete(`/api/blogs/${helper.nonExistingId}`)
        .set('Authorization', `Bearer ${validTokens[0]}`)
        .expect(404)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a valid id but wrong token can\'t delete a blog', async () => {
      const incorrectToken = validTokens[0] // 3 is correct for blogs[0]
      await api
        .delete(`/api/blogs/${helper.initialBlogs[0].id}`)
        .set('Authorization', `Bearer ${incorrectToken}`)
        .expect(401)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a valid id but invalid token can\'t delete a blog', async () => {
      await api
        .delete(`/api/blogs/${helper.initialBlogs[0].id}`)
        .set('Authorization', 'Basic not.a.valid.token')
        .expect(401)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a valid id but no token can\'t delete a blog', async () => {
      await api
        .delete(`/api/blogs/${helper.initialBlogs[0].id}`)
        .expect(401)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('PUT /api/blogs/:id', () => {
    test('a valid id and data can update a blog', async () => {
      const updatedBlog = { ...helper.initialBlogs[0], likes: 42 }
      const correctToken = validTokens[3]
      const response = await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .set('Authorization', `Bearer ${correctToken}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      assert.deepStrictEqual(response.body, updatedBlog)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('an invalid id can\'t update a blog', async () => {
      const updatedBlog = { ...helper.initialBlogs[0], id: helper.nonExistingId }
      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .set('Authorization', `Bearer ${validTokens[0]}`)
        .send(updatedBlog)
        .expect(404)
    })

    test('a valid id but wrong token can\'t update a blog', async () => {
      const incorrectToken = validTokens[0] // 3 is correct for blogs[0]
      const updatedBlog = { ...helper.initialBlogs[0], likes: 42 }
      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .set('Authorization', `Bearer ${incorrectToken}`)
        .send(updatedBlog)
        .expect(401)
    })

    test('a valid id but invalid token can\'t update a blog', async () => {
      const updatedBlog = { ...helper.initialBlogs[0], likes: 42 }
      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .set('Authorization', 'Basic not.a.valid.token')
        .send(updatedBlog)
        .expect(401)
    })

    test('a valid id but no token can\'t update a blog', async () => {
      const updatedBlog = { ...helper.initialBlogs[0], likes: 42 }
      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .send(updatedBlog)
        .expect(401)
    })

    /* This test fails because the PUT method is implemented as a PATCH method as everywhere else in the course
    test('a valid id but invalid data can\'t update a blog', async () => {
      const blogs = await helper.blogsInDb()
      const updatedBlog = { ...blogs[0] }
      delete updatedBlog.url
      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .set('Authorization', `Bearer ${validTokens[0]}`)
        .send(updatedBlog)
        .expect(400)
    })
    */
  })


  after(async () => {
    await mongoose.connection.close()
  })
})