import { useState, useEffect } from 'react'

import dbService from './services/db'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [notification, setNotification] = useState({ message: null })

  useEffect(() => {
    dbService.setNotificationHandler(
      (message, isError) => {
        setNotification({message, isError})
        setTimeout(() => {
          setNotification({message:null})
        }, 5000)
      }
    )
    dbService
      .getAll()
      .then(initialPersons => {
        if(initialPersons !== null) setPersons(initialPersons)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find((p) => p.name === newName)
    if (existingPerson) {// update number
      if (!confirm(`Replace existing number of ${existingPerson.name}?`)) return
      dbService
        .update(existingPerson.id, { ...existingPerson, number: newNumber })
        .then(returnedPerson => {
          if (returnedPerson !== null) {
            setPersons(persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
          } else {
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          }
        })
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      dbService
        .create(personObject)
        .then(returnedPerson => {
          if (returnedPerson !== null) { setPersons(persons.concat(returnedPerson)) }
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const removePerson = (id, name) => {
    if (!confirm(`Delete ${name}?`)) return
    dbService.remove(id, name)

    // this needs to be done either way (remove or desync)
    setPersons(persons.filter(person => person.id !== id))
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
    (person) => person.name.toLowerCase().includes(filterName)
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filterName} onChange={handleFilterNameChange} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        name={newName}
        onNameChange={handleNewNameChange}
        number={newNumber}
        onNumberChange={handleNewNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={shownPersons} removeHandler={removePerson} />
    </div>
  )
}

export default App