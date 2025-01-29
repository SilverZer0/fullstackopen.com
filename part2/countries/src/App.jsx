import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import CountryList from './components/CountryList'
import Country from './components/Country'

import countryService from './services/countries'

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(
        initialCountries => setCountries(initialCountries)
      )
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase())
  }

  const matchingCountries = countries.filter(
    (country) => country.name.common.toLowerCase().includes(filter)
  )

  if (matchingCountries.length === 1) {
    if (country === null
      || country.name.common !== matchingCountries[0].name.common) {
      //setCountry({ name: { common: "loading" } })
      countryService
        .getCountry(matchingCountries[0].name.common)
        .then(data => setCountry(data))
    }
  } else if (country !== null) {
    setCountry(null)
  }

  return (
    <div>
      <Filter value={filter} onChange={handleFilterChange} />
      <CountryList countries={matchingCountries} />
      {
        country !== null
          ? <Country country={country} />
          : <></>
      }
    </div>
  )
}

export default App