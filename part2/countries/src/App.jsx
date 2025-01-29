import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import CountryList from './components/CountryList'
import Country from './components/Country'

import countryService from './services/countries'

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(null)
  const [bitmask, setBitMask] = useState([])

  useEffect(() => {
    countryService
      .getAll()
      .then(
        fetchedCountries => {
          setCountries(fetchedCountries)
          setBitMask(new Array(fetchedCountries.length).fill(1))
        }
      )
  }, [])

  const handleFilterChange = (event) => {
    const value = event.target.value.toLowerCase()
    const newBitmask = countries.map(
      (country) => country.name.common.toLowerCase().includes(value)
    )
    console.log(newBitmask)
    const newCount = newBitmask.reduce((a, b) => a + b, 0)
    setFilter(value)
    setBitMask(newBitmask)
    if (newCount === 1) {
      getCountry(countries[newBitmask.findIndex(bit => bit)].name.common)
    } else {
      setCountry(null)
    }
  }

  const getCountry = (countryName) => {
    countryService
      .getCountry(countryName)
      .then(data => setCountry(data))
  }

  return (
    <div>
      <Filter value={filter} onChange={handleFilterChange} />
      {
        country === null
          ? <CountryList
            countries={countries.filter((_, index) => bitmask[index])}
            getCountry={getCountry}
          />
          : <Country country={country} />
      }
    </div>
  )
}

export default App