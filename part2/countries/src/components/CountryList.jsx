const CountryList = ({ countries }) => {
    if (countries.length === 1) return null
    if (countries.length > 10) {
        return <div>Too many matches, specify another filter</div>
    }
    if (countries.length < 1) {
        return <div>No matches, specify another filter</div>
    }
    return (
        <div>
            {countries.map(c =>
                <div key={c.name.common}>{c.name.common}</div>
            )}
        </div>
    )
}

export default CountryList