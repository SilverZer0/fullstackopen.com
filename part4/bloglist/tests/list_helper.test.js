const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const oneBlog = [
  {
    id: 0,
    title: 'title 0',
    author: 'author A',
    likes: 42
  }
]

const manyBlogs = [
  {
    id: 0,
    title: 'title 0',
    author: 'author A',
    likes: 2
  },
  {
    id: 1,
    title: 'title 1',
    author: 'author B',
    likes: 5
  },
  {
    id: 2,
    title: 'title 2',
    author: 'author A',
    likes: 3
  },
  {
    id: 3,
    title: 'title 3',
    author: 'author C',
    likes: 5
  },
  {
    id: 4,
    title: 'title 4',
    author: 'author B',
    likes: 7
  }
]

test('dummy returns one', () => {
  assert.strictEqual(listHelper.dummy([]), 1)
})

describe('total likes', () => {
  test('of list with one blog equals its likes', () => {
    assert.strictEqual(listHelper.totalLikes(oneBlog), 42)
  })

  test('of a bigger list in calculated right', () => {
    assert.strictEqual(listHelper.totalLikes(manyBlogs), 22)
  })

  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })
})

describe('favorite blog', () => {
  test('of list with one blog equals the blog', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(oneBlog), oneBlog[0])
  })

  test('of a bigger list in determined correctly', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(manyBlogs), manyBlogs[4])
  })

  test('of empty list is an empty object', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), {})
  })
})

describe('most blogs', () => {
  test('of list with one blog equals its author and 1', () => {
    assert.deepStrictEqual(
      listHelper.mostBlogs(oneBlog),
      { author: oneBlog[0].author, blogs: 1 }
    )
  })

  test('of a bigger list in determined correctly', () => {
    assert.deepStrictEqual(
      listHelper.mostBlogs(manyBlogs),
      { author: manyBlogs[0].author, blogs: 2 }
    )
  })

  test('of empty list is an empty object', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), {})
  })
})

describe('most likes', () => {
  test('of list with one blog equals its author and likes', () => {
    assert.deepStrictEqual(
      listHelper.mostLikes(oneBlog),
      { author: oneBlog[0].author, likes: oneBlog[0].likes }
    )
  })

  test('of a bigger list in determined correctly', () => {
    assert.deepStrictEqual(
      listHelper.mostLikes(manyBlogs),
      { author: manyBlogs[1].author, likes: 12 }
    )
  })

  test('of empty list is an empty object', () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), {})
  })
})