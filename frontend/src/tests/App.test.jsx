import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";

// Mocking the fetch API call
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        location: "London",
        openweather_temp: 12,
        weatherapi_temp: 14,
      }),
  })
);

test("allows user to enter location", () => {
  render(<App />);

  // Find the input field
  const inputElement = screen.getByPlaceholderText("Enter location...");

  // Simulate user typing "London"
  fireEvent.change(inputElement, { target: { value: "London" } });

  // Check that the input field contains "London"
  expect(inputElement.value).toBe("London");
});

test("triggers weather fetch on button click", () => {
    render(<App />);
  
    // Find input field and button
    const inputElement = screen.getByPlaceholderText("Enter location...");
    const buttonElement = screen.getByText("Get Weather");
  
    // Simulate user typing
    fireEvent.change(inputElement, { target: { value: "London" } });
  
    // Simulate button click
    fireEvent.click(buttonElement);
  
    // Check if the expected output appears
    const resultText = screen.getByText(/Weather Comparison for:/);
    expect(resultText).toBeInTheDocument();
  });

  test("fetches and displays weather data from backend", async () => {
    render(<App />);
  
    // Enter a city name into the input field
    const inputElement = screen.getByPlaceholderText("Enter location...");
    fireEvent.change(inputElement, { target: { value: "London" } });
  
    // Click the fetch button
    const buttonElement = screen.getByText("Get Weather");
    fireEvent.click(buttonElement);
  
    // Wait for the API response and check if data is displayed correctly
    await waitFor(() =>
      expect(screen.getByText("Weather Comparison for: London")).toBeInTheDocument()
    );
    expect(screen.getByText("OpenWeatherMap Temperature: 12°C")).toBeInTheDocument();
    expect(screen.getByText("WeatherAPI Temperature: 14°C")).toBeInTheDocument();
  });

  test("calculates the correct average temperature", async () => {
    render(<App />);
  
    // Enter city in search field
    const inputElement = screen.getByPlaceholderText("Enter location...");
    fireEvent.change(inputElement, { target: { value: "London" } });
  
    // Click button
    const buttonElement = screen.getByText("Get Weather");
    fireEvent.click(buttonElement);
  
    // Wait for avarage tempature to display on display
    expect(await screen.findByText(/Average Temperature: 13°C/)).toBeInTheDocument();
  });
  
  test("calculates the correct temperature difference", async () => {
    render(<App />);
  
    // Enter city in search field
    const inputElement = screen.getByPlaceholderText("Enter location...");
    fireEvent.change(inputElement, { target: { value: "London" } });
  
    // Click button
    const buttonElement = screen.getByText("Get Weather");
    fireEvent.click(buttonElement);
  
    // Wait for temperaature diffrence to show on display
    expect(await screen.findByText(/Temperature Difference: 2°C/)).toBeInTheDocument();
  });
  

  test("displays temperature results after clicking button", async () => {
    render(<App />);
  
    // inputfield and button
    const inputElement = screen.getByPlaceholderText("Enter location...");
    const buttonElement = screen.getByText("Get Weather");
  
    // User types location
    fireEvent.change(inputElement, { target: { value: "London" } });
  
    // User clicks button
    fireEvent.click(buttonElement);
  
    // Checks that the temperatures are displayed on the screen
    expect(await screen.findByText(/OpenWeatherMap Temperature:/)).toBeInTheDocument();
    expect(await screen.findByText(/WeatherAPI Temperature:/)).toBeInTheDocument();
    expect(await screen.findByText(/Temperature Difference:/)).toBeInTheDocument();
    expect(await screen.findByText(/Average Temperature:/)).toBeInTheDocument();
  });

  test("shows error if location is not provided", async () => {
    render(<App />);
  
    // Button
    const buttonElement = screen.getByText("Get Weather");
  
    // Clicking the button without input
    fireEvent.click(buttonElement);
  
    // Checks that the error message is displayed
    expect(await screen.findByText(/Location is required/)).toBeInTheDocument();
  });

  test("shows error if the entered location is not found", async () => {
    render(<App />);
  
    // Enter an unknown city
    const inputElement = screen.getByPlaceholderText("Enter location...");
    fireEvent.change(inputElement, { target: { value: "UnknownCity123" } });
  
    // Click the button
    const buttonElement = screen.getByText("Get Weather");
    fireEvent.click(buttonElement);
  
    // Wait for the error message to appear
    expect(await screen.findByText(/Location not found/)).toBeInTheDocument();
  });