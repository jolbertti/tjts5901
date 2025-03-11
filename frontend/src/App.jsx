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
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      setError("Location is required");
      return;
    }

    setError(""); //Deletes error message, if input is given

    // Simulated API call response for now
    const openWeatherResponse = 12; // Example value
    const weatherApiResponse = 14;  // Example value

    setOpenWeatherTemp(openWeatherResponse);
    setWeatherApiTemp(weatherApiResponse);
    setAverageTemp(((openWeatherResponse + weatherApiResponse) / 2).toFixed(1));
    setTempDifference(Math.abs(openWeatherResponse - weatherApiResponse));
  };

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
          {error && <p className="error-message">{error}</p>}
      </div>

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
