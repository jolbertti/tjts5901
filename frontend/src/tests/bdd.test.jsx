import React from "react";
import { render, screen, fireEvent, waitFor, act, within } from "@testing-library/react";
import App from "../App";

// Mocks API before every test
beforeEach(() => {
  global.fetch = jest.fn((url) =>
    Promise.resolve({
      ok: !url.includes("UnknownCity123"),
      json: () =>
        Promise.resolve(
          url.includes("UnknownCity123")
            ? { error: `Nothing found for city "UnknownCity123", please check spelling` }
            : { openweather_temp: 12.0, weatherapi_temp: 14.0 } // Simulated successful response
        ),
    })
  );
});

describe("Weather App - BDD", () => {
  
  // TEST 1: User successfully retrieves weather data
  test("User enters a city and sees weather data", async () => {
    
    // 🟢 GIVEN: The user opens the application
    render(<App />);
    
    // 🟡 WHEN: The user enters a city and clicks the "Get Weather" button
    const inputElement = screen.getByPlaceholderText("Enter location...");
    const buttonElement = screen.getByText("Get Weather");

    await act(async () => {
      fireEvent.change(inputElement, { target: { value: "London" } }); // User enters "London"
      fireEvent.click(buttonElement); // User clicks the button
    });

    // 🔵 THEN: The application displays the weather data
    const parentDiv = await screen.findByRole("region", { name: /Weather Comparison for:/ });
    
    // Expected calculated values
    const openWeatherTemp = 12.0.toFixed(1);
    const weatherApiTemp = 14.0.toFixed(1);
    const expectedAverage = ((12.0 + 14.0) / 2).toFixed(1) + "°C";
    const expectedDifference = Math.abs(12.0 - 14.0).toFixed(1) + "°C";
    
    // Verify individual temperature values
    // OpenWeatherMap Temperature
    expect(within(parentDiv).getByText(/OpenWeatherMap Temperature:/)).toBeInTheDocument();
    expect(within(parentDiv).getByText(new RegExp(`^${openWeatherTemp}°C$`))).toBeInTheDocument();

    // WeatherAPI Temperature
    expect(within(parentDiv).getByText(/WeatherAPI Temperature:/)).toBeInTheDocument();
    expect(within(parentDiv).getByText(new RegExp(`^${weatherApiTemp}°C$`))).toBeInTheDocument();

    // Average Temperature
    const avgTempElement = within(parentDiv).getByText(/Average Temperature:/).closest("p");
    expect(within(avgTempElement).getByText(new RegExp(`^${expectedAverage}$`))).toBeInTheDocument();

    // Temperature Difference
    const diffTempElement = within(parentDiv).getByText(/Temperature Difference:/).closest("p");
    expect(within(diffTempElement).getByText(new RegExp(`^${expectedDifference}$`))).toBeInTheDocument();


  });

  // TEST 2: User enters an unknown city
  test("User enters an unknown city and sees an error message", async () => {
    
    // 🟢 GIVEN: The user opens the application
    render(<App />);
  
    // 🟡 WHEN: The user enters an unknown city and clicks the button
    const inputElement = screen.getByPlaceholderText("Enter location...");
    const buttonElement = screen.getByText("Get Weather");
  
    await act(async () => {
      fireEvent.change(inputElement, { target: { value: "UnknownCity123" } }); // User enters an unknown city
      fireEvent.click(buttonElement); // User clicks the button
    });
  
    // 🔵 THEN: The application displays an error message
    await waitFor(() => expect(screen.getByText(/Nothing found for city "UnknownCity123", please check spelling/)).toBeInTheDocument());
  });

  // TEST 3: Backend is down and the user sees an error message
  test("User sees an error message when the backend is down", async () => {
    
    // 🟢 GIVEN: The user opens the application
    render(<App />);
  
    // 🟡 WHEN: The user tries to fetch weather data, but the backend is down
    global.fetch = jest.fn(() => Promise.reject(new Error("Failed to fetch")));
  
    const inputElement = screen.getByPlaceholderText("Enter location...");
    const buttonElement = screen.getByText("Get Weather");
  
    await act(async () => {
      fireEvent.change(inputElement, { target: { value: "Helsinki" } }); // User enters "Helsinki"
      fireEvent.click(buttonElement); // User clicks the button
    });
  
    // 🔵 THEN: The application displays an error message
    await waitFor(() => expect(screen.getByText(/Unable to connect to the weather service. Please try again later./)).toBeInTheDocument());
  });

  // TEST 4: User submits empty search and sees an error message
  test("User submits an empty location and sees an error message", async () => {
    // 🟢 GIVEN: The user opens the application
    render(<App />);
  
    // 🟡 WHEN: The user clicks the "Get Weather" button without entering a location
    const buttonElement = screen.getByText("Get Weather");
  
      await act(async () => {
      fireEvent.click(buttonElement); // Click without entering anything
    });
    
    // 🔵 THEN: The application displays an error message
    await waitFor(() => expect(screen.getByText(/Location is required/)).toBeInTheDocument());
    });
});
