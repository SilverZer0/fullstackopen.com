import { useState, useEffect, useRef } from 'react'

import Blogs from './components/Blogs'
import Notification from './components/Notification'
import Login from './components/Login'
import AddBlog from './components/AddBlog'
import Toggleable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null })
  const [user, setUser] = useState(null)

  const newBlogFormRef = useRef()

  const notificationHandler = (message, isError) => {
    setNotification({ message, isError })
    setTimeout(() => { setNotification({ message: null }) }, 5000)
  }

  useEffect(() => {
    (async () => {
      try {
        let a = await blogService.getAll()
        setBlogs(a)
      } catch {
        notificationHandler('failed to load blogs', true)
      }
    })()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('BlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('BlogUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      notificationHandler('Login successful', false)
      return true
    } catch {
      notificationHandler('Wrong username or password', true)
    }
  }

  const logout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('BlogUser')
    notificationHandler('Logout successful', false)
  }

  const addBlog = async (blog) => {
    try {
      const returnedBlog = await blogService.create(blog)
      setBlogs(blogs.concat({ ...returnedBlog, user: user }))
      notificationHandler(
        `added new blog: ${returnedBlog.title} by ${returnedBlog.author}`,
        false
      )
      newBlogFormRef.current.toggleVisibility()
      return true
    } catch (error) {
      notificationHandler(`failed to add blog (${error.response.data.error})`, true)
    }
  }

  const likeHandler = async (blog) => {
    try {
      const updatedBlog = await blogService.update(
        blog.id,
        {
          ...blog,
          likes: blog.likes + 1,
          user: blog.user.id
        }
      )
      if (updatedBlog) {
        setBlogs(blogs.map(
          blog => blog.id !== updatedBlog.id
            ? blog
            : { ...blog, likes: updatedBlog.likes }
        ))
      } else {
        setBlogs(blogs.filter(b => b.id !== updatedBlog.id))
        notificationHandler('Liked blog was not found', true)
      }
      return true
    } catch {
      notificationHandler('Failed to like blog', true)
    }
  }

  const deleteHandler = async (blog) => {
    try {
      if (!confirm(`Delete Blog "${blog.title}"?`)) {
        return
      }
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      notificationHandler('Blog was deleted', false)
      return true
    } catch {
      notificationHandler('Failed to delete blog', true)
    }
  }

  const makeDeleteButton = (blog) => {
    if (blog.user.username !== user.username) {
      return null
    }
    return (
      <div>
        <button
          onClick={() => deleteHandler(blog)}>
          delete
        </button>
      </div>
    )
  }

  if (user === null) {
    return (
      <div>
        <h2>log in</h2>
        <Notification notification={notification} />
        <Login login={login} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.username} logged in&nbsp;
        <button onClick={logout}>log out</button>
      </p>
      <Toggleable buttonLabel="add blog" ref={newBlogFormRef}>
        <AddBlog addBlog={addBlog} />
      </Toggleable>
      <Blogs
        blogs={blogs}
        likeHandler={likeHandler}
        makeDeleteButton={makeDeleteButton}
      />
    </div>
  )
}

export default App