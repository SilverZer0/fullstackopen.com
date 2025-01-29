const Person = ({ person, onRemove }) => (
    <div>
        {person.name} {person.number} <button onClick={onRemove}>remove</button>
    </div>
)

const Persons = ({ persons, removeHandler }) => (
    <div>
        {persons.map((person) =>
            <Person
                key={person.id}
                person={person}
                onRemove={() => removeHandler(person.id, person.name)}
            />
        )}
    </div>
)

export default Persons