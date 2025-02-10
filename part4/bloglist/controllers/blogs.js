const notesRouter = require('express').Router()
const Blog = require('../models/blog')

notesRouter.get('/', async (request, response) => {
  response.json(await Blog.find({}))
})

notesRouter.post('/', async (request, response) => {
  const savedBlog = await new Blog(request.body).save()
  response.status(201).json(savedBlog)
})

module.exports = notesRouter