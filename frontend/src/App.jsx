import { useState } from 'react'
import './App.css'

function App() {
  const [location, setLocation] = useState('')
  const [openWeatherTemp, setOpenWeatherTemp] = useState(null)
  const [weatherApiTemp, setWeatherApiTemp] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // This will be implemented later when backend is ready
    console.log('Location submitted:', location)
  }

  return (
    <div className="container">
      <h1>Weather API Comparison</h1>
      
      <div className="search-section">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location..."
          className="location-input"
        />
        <button onClick={handleSubmit} className="submit-button">
          Get Weather
        </button>
      </div>

      <div className="temperature-boxes">
        <div className="temp-box">
          <h2>OpenWeatherAPI</h2>
          <div className="temperature">
            {openWeatherTemp !== null ? `${openWeatherTemp}°C` : '-'}
          </div>
        </div>

        <div className="temp-box">
          <h2>WeatherAPI</h2>
          <div className="temperature">
            {weatherApiTemp !== null ? `${weatherApiTemp}°C` : '-'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App