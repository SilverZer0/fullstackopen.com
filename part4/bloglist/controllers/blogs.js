const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor, verifyPoster } = require('../utils/middleware')
const _ = require('lodash')

blogsRouter.get('/', async (request, response) => {
  response.json(
    await Blog.find({})
      .populate('user', { username: 1, name: 1 })
  )
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog({
    ...request.body,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, verifyPoster, async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', userExtractor, verifyPoster, async (request, response) => {
  const blog = (await Blog.findById(request.params.id)).toJSON()
  blog.likes += 1
  delete blog.user

  if (!request.userIsPoster && !_.isEqual(blog, request.body)) {
    //only the poster is allowed make any changes other than adding one like
    return response.status(401).json({ error: 'Unauthorized update' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  )
  response.json(updatedBlog)
})

module.exports = blogsRouter