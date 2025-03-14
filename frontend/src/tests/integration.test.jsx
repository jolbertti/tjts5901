import React from "react";
import { render, screen, fireEvent, waitFor, act, within } from "@testing-library/react";
import App from "../App";
const fetch = require("node-fetch");
global.fetch = fetch;


test("fetches real weather data from backend", async () => {
  render(<App />);

  // Simulate user writing city and clicking button
  const inputElement = screen.getByPlaceholderText("Enter location...");
  const buttonElement = screen.getByText("Get Weather");

  await act(async () => {
    fireEvent.change(inputElement, { target: { value: "Helsinki" } });
    fireEvent.click(buttonElement);
  });

  // Wait until backend response has been processed and UI updates
  const resultsSection = await waitFor(() =>
    screen.getByText(/Weather Comparison for:/), { timeout: 5000 }
  );
  const parentDiv = resultsSection.closest(".results");

  // Ensure temperature texts are correctly displayed in the UI
  expect(within(parentDiv).getByText(/OpenWeatherMap Temperature:/)).toBeInTheDocument();
  expect(within(parentDiv).getByText(/WeatherAPI Temperature:/)).toBeInTheDocument();
});

test("shows error message if backend is down", async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("Failed to fetch"))
    );
  
    render(<App />);
  
    const inputElement = screen.getByPlaceholderText("Enter location...");
    const buttonElement = screen.getByText("Get Weather");
  
    await act(async () => {
      fireEvent.change(inputElement, { target: { value: "Helsinki" } });
      fireEvent.click(buttonElement);
    });
  
    // Wait for the improved error message to appear
    expect(await screen.findByText(/Unable to connect to the weather service. Please try again later./)).toBeInTheDocument();
  });
