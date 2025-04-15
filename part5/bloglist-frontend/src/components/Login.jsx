import PropTypes from 'prop-types'
import { useState } from 'react'

const Login = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const loginHandler = async (event) => {
    event.preventDefault()
    if (await login(username, password)) {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <form onSubmit={loginHandler} className='loginForm'>
      <div>
        <label>
          username&nbsp;
          <input
            type="text" value={username} name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password&nbsp;
          <input
            type="password" value={password} name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired
}

export default Login