import { useState, useEffect } from 'react'

import Blogs from './components/Blogs'
import Notification from './components/Notification'
import Login from './components/Login'
import AddBlog from './components/AddBlog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null })
  const [user, setUser] = useState(null)

  const notificationHandler = (message, isError) => {
    setNotification({ message, isError })
    setTimeout(() => { setNotification({ message: null }) }, 5000)
  }

  useEffect(() => {
    (async () => {
      try {
        setBlogs(await blogService.getAll())
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

  const makeAddNoteHandler = (title, author, url, emptyInputs) => async (event) => {
    event.preventDefault()
    try {
      const returnedBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(returnedBlog))
      emptyInputs()
      notificationHandler(
        `added new blog: ${returnedBlog.title} by ${returnedBlog.author}`,
        false
      )
    } catch (error) {
      notificationHandler(`failed to add blog (${error.response.data.error})`, true)
    }
  }

  const makeLoginHandler = (username, password, emptyInputs) => async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('BlogUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      emptyInputs()
      notificationHandler('Login successful', false)
    } catch {
      notificationHandler('Wrong username or password', true)
    }
  }

  const logoutHandler = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('BlogUser')
    notificationHandler('Logout successful')
  }

  if (user === null) {
    return (
      <div>
        <h2>log in</h2>
        <Notification notification={notification} />
        <Login makeLoginHandler={makeLoginHandler} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>{user.username} logged in <button onClick={logoutHandler}>log out</button></p>
      <AddBlog makeAddNoteHandler={makeAddNoteHandler} />
      <Blogs blogs={blogs} />
    </div>
  )
}

export default App