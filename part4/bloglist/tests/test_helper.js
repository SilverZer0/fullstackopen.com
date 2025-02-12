const mongoose = require('mongoose')

const Blog = require('../models/blog')
const User = require('../models/user')

const nonExistingId = '0123456789abcdef01234567'

const initialBlogs = [
  {
    id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: '67ab76b65f641f7ebf8340ec'
  },
  {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '67ab76af5f641f7ebf8340ea'
  },
  {
    id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: '67ab76af5f641f7ebf8340ea'
  },
  {
    id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    user: '67ab76a55f641f7ebf8340e8'
  },
  {
    id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: '67ab76b65f641f7ebf8340ec'
  },
  {
    id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: '67ab76af5f641f7ebf8340ea'
  }
]

const initialUsers = [
  {
    id: '67ab76a55f641f7ebf8340e8',
    username: 'albertE',
    name: 'Albert Einstein',
    blogs: [
      '5a422b891b54a676234d17fa'
    ],
    passwordHash: '$2a$10$YLhu0pgHUAaX.7O1IYg9huBZYAO4oe0CGMzTpetp/n0YEGmeVHkCK',
    password: 'Relativitätstheorie'
  },
  {
    id: '67ab76af5f641f7ebf8340ea',
    username: 'marieC',
    name: 'Marie Curie',
    blogs: [
      '5a422aa71b54a676234d17f8',
      '5a422b3a1b54a676234d17f9',
      '5a422bc61b54a676234d17fc'
    ],
    passwordHash: '$2a$10$H6yGi6ys6XeE9cgzjK4LD.WsMX.6eUjMT6xkcKf4.NVmLf6AZJsVS',
    password: 'Radioactivité'
  },
  {
    id: '67aba09dddae25e1218eb286',
    username: 'stephenH',
    name: 'Stephen Hawking',
    blogs: [],
    passwordHash: '$2a$10$K9DTM63QmwRS300W3U6iyOMX/BYaG3Bmd76Vix7XiEfJPAygJrKqG ',
    password: 'Black Holes'
  },
  {
    id: '67ab76b65f641f7ebf8340ec',
    username: 'nielsB',
    name: 'Niels Bohr',
    blogs: [
      '5a422a851b54a676234d17f7',
      '5a422ba71b54a676234d17fb'
    ],
    passwordHash: '$2a$10$CD7xShrEwKtI0VQ8LqtvKeC6X1JXb9D/9TNhUc35wgWMS/JiwpSEW',
    password: 'Kvantemekanik'
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const resetBlogs = async () => {
  await Blog.deleteMany({})
  const blogObjects = initialBlogs.map(blog => {
    const blogCopy = { ...blog }
    blogCopy._id = new mongoose.Types.ObjectId(blogCopy.id)
    delete blogCopy.id
    blogCopy.user = new mongoose.Types.ObjectId(blogCopy.user)
    return new Blog(blogCopy)
  })
  await Promise.all(blogObjects.map(blog => blog.save()))
}

const resetUsers = async () => {
  await User.deleteMany({})
  const userObjects = initialUsers.map(user => {
    const userCopy = { ...user }
    userCopy._id = new mongoose.Types.ObjectId(userCopy.id)
    delete userCopy.id
    delete userCopy.password
    userCopy.blogs = userCopy.blogs.map(id => new mongoose.Types.ObjectId(id))
    return new User(userCopy)
  })
  await Promise.all(userObjects.map(user => user.save()))
}

const resetDb = async () => {
  await resetBlogs()
  await resetUsers()
}

module.exports = {
  initialBlogs,
  initialUsers,
  nonExistingId,
  blogsInDb,
  usersInDb,
  resetDb
}