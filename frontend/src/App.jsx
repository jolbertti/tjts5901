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

  // Handles user input in the search box
  const handleInputChange = (e) => {
    setLocation(e.target.value);
    setError(""); // Clear previous error messages when typing a new location
    setOpenWeatherTemp(null); // Reset previous results
    setWeatherApiTemp(null);
    setAverageTemp(null);
    setTempDifference(null);
  };

  // Handles form submission when user clicks "Get Weather"
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      setError("Location is required");
      return;
    }

    setError(""); // Clear any previous error message before making the API request

    try {
      const response = await fetch(`http://127.0.0.1:65517/temperature?city=${location}`);

      let errorData = {};
      try {
        errorData = await response.json();
      } catch (err) {
        console.error("Error parsing JSON response:", err);
      }

      // Check for different error types
      if (response.status === 404) {
        // City not found case
        setError(errorData.error || `Nothing found for city "${location}", please check spelling`);
      } else if (response.status === 500) {
        // Backend error case
        setError("Unable to connect to the weather service. Please try again later.");
      } else if (!response.ok) {
        // Other unexpected errors
        setError(errorData.error || "Unexpected error occurred. Please try again.");
      } else {
        // Successfully received data, update state
        const data = errorData;
        setOpenWeatherTemp(data.openweather_temp.toFixed(1));
        setWeatherApiTemp(data.weatherapi_temp.toFixed(1));
        setAverageTemp(((data.openweather_temp + data.weatherapi_temp) / 2).toFixed(1));
        setTempDifference(Math.abs(data.openweather_temp - data.weatherapi_temp).toFixed(1));
      }
    } catch (error) {
      // Handles network errors or when the backend is completely unavailable
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

      {/* Display results only if both APIs return a valid temperature */}
      {openWeatherTemp !== null && weatherApiTemp !== null && (
        <div className="results" role="region" aria-label={`Weather Comparison for: ${location}`}>
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
