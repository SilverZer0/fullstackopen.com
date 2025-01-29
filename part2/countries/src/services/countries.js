import axios from 'axios'
import WEATHER_API_KEY from '../secret' // env didn't work at all

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
const weatherBaseUrl = 'http://api.weatherapi.com/v1/current.json'

const getAll = () => {
    return axios
        .get(`${baseUrl}/all`)
        .then(response => response.data)
}

const getCountry = (country) => {
    return axios
        .get(`${baseUrl}/name/${country}`)
        .then(response => response.data)
        .catch(error => {
            alert(`Failed to fetch ${country}`)
            return null
        })
}

const getWeather = (city) => {
    return axios
        .get(`${weatherBaseUrl}?q=${city}&key=${WEATHER_API_KEY}&aqi=no`)
        .then(response => response.data.current)
        .catch(error => {
            alert(`Failed getting weather for ${city}`)
            return null
        })
}

export default { getAll, getCountry, getWeather }