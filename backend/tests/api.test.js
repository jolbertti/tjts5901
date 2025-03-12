const request = require("supertest");
const express = require("express");
const temperatureRoutes = require("../src/routes/temperature"); // Adjust the path if needed
const { getOpenWeatherTemp, getWeatherApiTemp } = require("../src/services/weatherService");

// Mock the external API functions
jest.mock("../src/services/weatherService");

const app = express();
app.use("/temperature", temperatureRoutes);  // Use the router

describe("GET /temperature", () => {
  it("should return temperature data for a valid city", async () => {
    const city = "Helsinki";
    // Mock the API responses
    getOpenWeatherTemp.mockResolvedValue(10); // OpenWeather temp mock
    getWeatherApiTemp.mockResolvedValue(12); // WeatherAPI temp mock

    const response = await request(app).get(`/temperature?city=${city}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      city,
      openweather_temp: 10,
      weatherapi_temp: 12
    });
  });

  it("should return 400 if the city parameter is missing", async () => {
    const response = await request(app).get("/temperature");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "City parameter is required"
    });
  });

  it("should return 500 if an error occurs while fetching data", async () => {
    const city = "Helsinki";
    // Mock the API responses to simulate an error
    getOpenWeatherTemp.mockRejectedValue(new Error("API Error"));
    getWeatherApiTemp.mockRejectedValue(new Error("API Error"));

    const response = await request(app).get(`/temperature?city=${city}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Failed to fetch temperature data"
    });
  });
});
