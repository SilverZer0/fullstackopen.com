const Header = ({ name }) => <h2>{name}</h2>

const Content = ({ parts }) => (
  <div>
    {
      parts.map((part) => <Part key={part.id} part={part} />)
    }
  </div>
)

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Total = ({ total }) => <p><b>total of {total} exercises</b></p>

const Course = ({ course }) => (
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total total={course.parts.reduce((x, p) => x + p.exercises, 0)} />
  </div>
)

export default Course