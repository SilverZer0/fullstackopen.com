const _ = require('lodash')

const dummy = () => 1

const totalLikes = (blogs) =>
  blogs.reduce(
    (total, blog) =>
      total + blog.likes, 0
  )

const favoriteBlog = (blogs) => {
  if (!blogs.length) { return {} }
  return blogs.reduce(
    (currentBest, blog) =>
      currentBest.likes < blog.likes ? blog : currentBest
  )
}

const mostBlogs = (blogs) => {
  if (!blogs.length) { return {} }
  return _.zipObject(
    ['author', 'blogs'],
    _(blogs)
      .countBy('author')
      .entries()
      .maxBy(_.last)
  )
}

const mostLikes = (blogs) => {
  if (!blogs.length) { return {} }
  return _.zipObject(
    ['author', 'likes'],
    _(blogs)
      .groupBy('author')
      .entries()
      .map((v) => [v[0], totalLikes(v[1])])
      .maxBy(_.last)
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}