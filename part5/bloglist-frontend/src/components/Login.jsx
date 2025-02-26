import { useState } from 'react'

const Login = ({ makeLoginHandler }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const resetInputs = () => {
    setUsername('')
    setPassword('')
  }

  const loginHandler = makeLoginHandler(username, password, resetInputs)

  return (
    <form onSubmit={loginHandler}>
      <div>
        username:
        <input
          type="text" value={username} name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password:
        <input
          type="password" value={password} name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default Login