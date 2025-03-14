import React from "react";
import { useState } from 'react';
import './App.css';



function App() {
  const [location, setLocation] = useState('');
  const [openWeatherTemp, setOpenWeatherTemp] = useState(null);
  const [weatherApiTemp, setWeatherApiTemp] = useState(null);
  const [averageTemp, setAverageTemp] = useState(null);
  const [tempDifference, setTempDifference] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setLocation(e.target.value);
    setError(""); // Clear error when user types a new location
    setOpenWeatherTemp(null); // Clear previous results
    setWeatherApiTemp(null);
    setAverageTemp(null);
    setTempDifference(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!location) {
      setError("Location is required");
      return;
    }
  
    setError(""); // Deletes error message if input is given
  
    try {
      const response = await fetch(`http://localhost:5000/temperature?city=${location}`);
  
      if (!response.ok) {
        // If response is not OK, try to extract error message from backend
        setError(`Nothing found for city "${location}", please check spelling`);
        return;
      }
  
      const data = await response.json();

      setOpenWeatherTemp(data.openweather_temp.toFixed(1));
      setWeatherApiTemp(data.weatherapi_temp.toFixed(1));
      setAverageTemp(((data.openweather_temp + data.weatherapi_temp) / 2).toFixed(1));
      setTempDifference(Math.abs(data.openweather_temp - data.weatherapi_temp).toFixed(1));
    } catch (error) {
      setError("Unable to connect to the weather service. Please try again later.");
    }
  };

  return (
    <div className="container">
      <h1>Weather API Comparison</h1>
      
      <div className="search-section">
        <input
          type="text"
          value={location}
          onChange={handleInputChange}
          placeholder="Enter location..."
          className="location-input"
        />
        <button onClick={handleSubmit} className="submit-button">
          Get Weather
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}

      {openWeatherTemp !== null && weatherApiTemp !== null && (
        <div className="results">
          <h2>Weather Comparison for: {location}</h2>
          <p><strong>OpenWeatherMap Temperature:</strong> {openWeatherTemp}°C</p>
          <p><strong>WeatherAPI Temperature:</strong> {weatherApiTemp}°C</p>
          <p><strong>Temperature Difference:</strong> {tempDifference}°C</p>
          <p><strong>Average Temperature:</strong> {averageTemp}°C</p>
        </div>
      )}
    </div>
  );
}

export default App;
