const Weather = ({ weather: { temp_c, condition: { icon }, wind_kph } }) => (
    <>
        <dir>temperature {temp_c} Celsius</dir>
        <img src={"http:" + icon} style={{ minHeight: 100, minWidth: 100 }} />
        <dir>wind {wind_kph}</dir>
    </>
)

const Country = ({ country }) => (
    <div>
        <h1>{country.name.common}</h1>
        <div>capital {country.capital}</div>
        <div>area {country.area}</div>
        <p><b>languages:</b></p>
        <ul>
            {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
        </ul>
        <img src={country.flags.svg} style={{ maxHeight: 200, maxWidth: 200 }} />
        <h2>Weather in {country.capital}</h2>
        <Weather weather={country.weather} />
    </div>
)


export default Country