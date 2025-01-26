import { useState } from 'react'

const Heading = ({ text }) => <h1>{text}</h1>

const Button = (props) => {
  const [text, value, setValue] = props.option
  return (
    <button onClick={()=>setValue(value+1)}>{text}</button>
  )
}

const Stat = (props) => {
  const [text, value, setValue] = props.option
  return (
    <div>{text} {value}</div>
  )
}

const App = () => {
  const good = ["good"].concat(useState(0))
  const neutral = ["neutral"].concat(useState(0))
  const bad = ["bad"].concat(useState(0))

  return (
    <div>
      <Heading text="give feedback" />
      <Button option={good}/>
      <Button option={neutral}/>
      <Button option={bad}/>
      <Heading text="statistics" />
      <Stat option={good}/>
      <Stat option={neutral}/>
      <Stat option={bad}/>
    </div>
  )
}

export default App