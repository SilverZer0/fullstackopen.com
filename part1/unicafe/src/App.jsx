import { useState } from 'react'

const Feedback = ({ options }) => {
  return (
    <div>
      <Heading text="give feedback" />
      {options.map(([text, value, setValue]) =>
        <Button text={text} onClick={() => setValue(value + 1)} />
      )}
    </div>
  )
}

const Statistics = ({ options }) => {
  const all = options.reduce((a, b) => a + b[1], 0)
  if (all === 0) {
    return (
      <div>
        <Heading text="statistics" />
        <p>No feedback given</p>
      </div>
    )
  }
  const avg = (options[0][1] - options[2][1]) / all
  const pos = options[0][1] / all * 100

  return (
    <div>
      <Heading text="statistics" />
      {options.map(([text, value, setValue]) =>
        <StatisticLine text={text} value={value} />
      )}
      <StatisticLine text="all" value={all} />
      <StatisticLine text="average" value={avg} />
      <StatisticLine text="positive" value={pos + " %"} />
    </div>
  )
}

const Heading = ({ text }) => <h1>{text}</h1>

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value }) => <div>{text} {value}</div>

const App = () => {
  const good = ["good"].concat(useState(0))
  const neutral = ["neutral"].concat(useState(0))
  const bad = ["bad"].concat(useState(0))

  const options = [good, neutral, bad]

  return (
    <div>
      <Feedback options={options} />
      <Statistics options={options} />
    </div>
  )
}

export default App