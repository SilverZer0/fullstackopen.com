import { useState } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  const addPerson = (event) => {
    event.preventDefault()    
    if(persons.some((p)=>p.name===newName)){
      alert(`${newName} is already added to phonebook`)
      return
    }
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length +1
    }
  
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNewNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value.toLowerCase())
  }

  const shownPersons = persons.filter(
    (person)=>person.name.toLowerCase().includes(filterName)
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterName} onChangeHandler={handleFilterNameChange}/>
      <h2>add a new</h2>
      <PersonForm 
        onSubmitHandler={addPerson}
        name={newName}
        nameHandler={handleNewNameChange}
        number={newNumber}
        numberHandler={handleNewNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={shownPersons}/>
    </div>
  )
}

export default App