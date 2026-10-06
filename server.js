require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

// const frontendpath = path.join(__dirname, '../frontend');
app.use(cors());
// app.use(express.static(frontendpath));
const API_KEY = process.env.OPEN_WEATHER_API_KEY;
const PORT = process.env.PORT || 3000;
if (!API_KEY) {
  console.error('please Provide API KEY');
  process.exit(1);
}
app.get('/api/weather', async (req, res) => {

  const city = req.query.city;
  if (!city) {
    return res.json({ message: 'provide a city' });
  }

  try {
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(city) + '&units=metric&appid=' + API_KEY;
    const weatherResponse = await fetch(url);

    if (weatherResponse.status === 404) {
      return res.status(404).json({ message: 'city not found' });
    }
    if (weatherResponse.status === 400) {
      return res.status(400).json({ message: 'provide a city' });
    }
    if (weatherResponse.status === 500) {
      return res.status(500).json({ message: 'can not fetch weather' });
    }

    const data = await weatherResponse.json();
    const { name, sys, main, wind, weather, coord, visibility } = data;

    console.log(`[Weather Request] City: ${name}, ${sys.country} | Temp: ${main.temp}°C | ${weather[0].description}`);
    res.json({
      city: name, country: sys.country,
      temp: main.temp, temp_max: main.temp_max, temp_min: main.temp_min,
      feels_like: main.feels_like, humidity: main.humidity, pressure: main.pressure,
      wind_speed: wind.speed, wind_deg: wind.deg, visibility,
      description: weather[0].description, lat: coord.lat, lon: coord.lon,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'can not fetch weather' });
  }

});
app.listen(PORT, () => {
  console.log('server is running on http://localhost:' + PORT);
});
