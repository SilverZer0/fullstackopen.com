const Country = ({ country }) => (
    <div>
        <h1>{country.name.common}</h1>
        <div>capital {country.capital}</div>
        <div>area {country.area}</div>
        <p><b>languages:</b></p>
        <ul>
            {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
        </ul>
        <img src={country.flags.svg} style={{maxHeight: 200, maxWidth: 200}}/>
    </div>
)

export default Country