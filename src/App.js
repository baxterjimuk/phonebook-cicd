import { Fragment, useEffect, useState } from 'react'
import personService from './services/persons'

const Filter = (props) =>
  <p>
    filter shown with <input value={props.filter} onChange={props.onChangeFilter} />
  </p>

const PersonForm = (props) =>
  <form onSubmit={props.onSubmit} >
    <div>
      name: <input value={props.newName} onChange={props.onChangeNewName} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.onChangeNewNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

// const Persons = (props) =>
//   <div>
//     {
//       props.personsToShow.map(person =>
//         <Person
//           key={person.name}
//           name={person.name}
//           number={person.number}
//           handleDelete={props.handleDelete(person.id)} />
//       )
//     }
//   </div>

const Person = (props) =>
  <>
    {props.name} {props.number}
    <button onClick={props.handleDelete}>delete</button>
    <br />
  </>

const Notification = ({ message }) => {
  if (message === null) return null
  return (
    <div className='notify'>
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) return null
  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => setPersons(response.data))
  }, [])

  const addPerson = (event) => {
    const nameExists = persons.find((obj) => obj.name === newName)
    if (nameExists) {
      const msg = `${newName} is already added to the phonebook, replace the old number with a new one?`
      if (window.confirm(msg)) {
        event.preventDefault()
        const changedPerson = { ...nameExists, number: newNumber }
        personService
          .update(nameExists.id, changedPerson)
          .then(response => {
            setMessage(`Changed ${newName} number`)
            setTimeout(() => setMessage(null), 5000)
            setPersons(persons.map(person => person.id !== nameExists.id ? person : response.data))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => setErrorMessage(null), 5000)
            setPersons(persons.filter(person => person.id !== nameExists.id))
          })
      }
    } else {
      event.preventDefault()
      const personObject = {
        name: newName,
        number: newNumber,
      }

      personService
        .create(personObject)
        .then(response => {
          setMessage(`Added ${newName}`)
          setTimeout(() => setMessage(null), 5000)
          setPersons(persons.concat(personObject))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          setTimeout(() => setErrorMessage(null), 5000)
          console.log(error.response.data)
        })
    }
  }

  const handleDelete = id => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.deleteOne(person.id)
      setPersons(persons.filter(p => p.id !== id))
    }
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleNewNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <ErrorNotification message={errorMessage} />
      <Filter filter={filter} onChangeFilter={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onChangeNewName={handleNewNameChange}
        newNumber={newNumber}
        onChangeNewNumber={handleNewNumberChange}
      />
      <h3>Numbers</h3>
      <>
        {personsToShow.map(person => {
          return <Person
            key={person.name}
            name={person.name}
            number={person.number}
            handleDelete={() => handleDelete(person.id)}
          />
        })}
      </>
    </div>
  )
}

export default App