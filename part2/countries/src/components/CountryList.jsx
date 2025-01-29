const CountryList = ({ countries, getCountry }) => {
    console.log(countries)
    const count = countries.length
    if (count === 1) return null
    if (count > 10) {
        return <div>Too many matches ({count}), specify another filter</div>
    }
    if (count < 1) {
        return <div>No matches, specify another filter</div>
    }
    return (
        <div>
            {countries.map(({name:{common:name}}) =>
                <div key={name}>
                    {name} <button onClick={()=>getCountry(name)}>show</button>
                </div>
            )}
        </div>
    )
}

export default CountryList