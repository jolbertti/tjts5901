const axios = require("axios");

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;

async function getOpenWeatherTemp(city) {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);
    return response.data.main.temp;
}

async function getWeatherApiTemp(city) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${city}`;
    const response = await axios.get(url);
    return response.data.current.temp_c;
}

module.exports = { getOpenWeatherTemp, getWeatherApiTemp };
