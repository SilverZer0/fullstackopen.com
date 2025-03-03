import { useState } from 'react'

const Feedback = ({ options }) => {
  return (
    <div>
      <Heading text="give feedback" />
      {options.map(([text, value, setValue]) =>
        <Button key={text} text={text} onClick={() => setValue(value + 1)} />
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
      <table>
        <tbody>
          {options.map(([text, value, setValue]) =>
            <StatisticLine key={text} text={text} value={value} />
          )}
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={avg} />
          <StatisticLine text="positive" value={pos + " %"} />
        </tbody>
      </table>
    </div>
  )
}

const Heading = ({ text }) => <h1>{text}</h1>

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>

const App = () => {
  const good = ["good", ...useState(0)];
  const neutral = ["neutral", ...useState(0)];
  const bad = ["bad", ...useState(0)];

  const options = [good, neutral, bad]

  return (
    <div>
      <Feedback options={options} />
      <Statistics options={options} />
    </div>
  )
}

export default App