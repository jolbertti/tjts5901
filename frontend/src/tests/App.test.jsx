import React from "react";
import { render, screen, fireEvent, waitFor, act, within } from "@testing-library/react";
import App from "../App";

// Mocking the fetch API call
global.fetch = jest.fn((url) => {
  return Promise.resolve({
    ok: !url.includes("UnknownCity123"), // Simulates error to unkonwn city
    json: () =>
      Promise.resolve(
        url.includes("UnknownCity123")
          ? { error: "Nothing found for city London, please check the spelling" }
          : { location: "London", openweather_temp: 12.0, weatherapi_temp: 14.0 }
      ),
  });
});

test("allows user to enter location", () => {
  render(<App />);

  // Find the input field
  const inputElement = screen.getByPlaceholderText("Enter location...");

  // Simulate user typing "London"
  fireEvent.change(inputElement, { target: { value: "London" } });

  // Check that the input field contains "London"
  expect(inputElement.value).toBe("London");
});

test("triggers weather fetch on button click", async () => {
  render(<App />);
  
  // Find input field and button
  const inputElement = screen.getByPlaceholderText("Enter location...");
  const buttonElement = screen.getByText("Get Weather");
  
  // Simulate user typing and clicking the button inside act(...)
  await act(async () => {
    fireEvent.change(inputElement, { target: { value: "London" } });
    fireEvent.click(buttonElement);
  });

  // Check if the expected output appears
  await waitFor(() => expect(screen.getByText(/Weather Comparison for:/)).toBeInTheDocument());
});

test("fetches and displays weather data from backend", async () => {
  render(<App />);

  // Simulate user typing a city name and clicking button
  const inputElement = screen.getByPlaceholderText("Enter location...");
  const buttonElement = screen.getByText("Get Weather");

  await act(async () => {
    fireEvent.change(inputElement, { target: { value: "London" } });
    fireEvent.click(buttonElement);
  });

  // Wait for the results section to appear and locate it
  const resultsSection = await screen.findByText(/Weather Comparison for:/);
  const parentDiv = resultsSection.closest(".results");

  // Verify that the correct temperature values are displayed inside the results section
  expect(within(parentDiv).getByText(/OpenWeatherMap Temperature:/)).toBeInTheDocument();
  expect(within(parentDiv).getByText(/12.0°C/)).toBeInTheDocument();
  expect(within(parentDiv).getByText(/WeatherAPI Temperature:/)).toBeInTheDocument();
  expect(within(parentDiv).getByText(/14.0°C/)).toBeInTheDocument();
});

test("calculates the correct average temperature", async () => {
  render(<App />);
  // Find the input field and the button
  const inputElement = screen.getByPlaceholderText("Enter location...");
  const buttonElement = screen.getByText("Get Weather");
  
  // Simulate user typing a city name and cliking button
  await act(async () => {
    fireEvent.change(inputElement, { target: { value: "London" } });
    fireEvent.click(buttonElement);
  });

  // Wait for the results section to appear and locate it
  const resultsSection = await screen.findByText(/Weather Comparison for:/);
  const parentDiv = resultsSection.closest(".results");

  // Verify that "Average Temperature" text is displayed within the results section 
  expect(within(parentDiv).getByText(/Average Temperature:/)).toBeInTheDocument();

  // Verify that the average temperature is displayed within the results section
  expect(within(parentDiv).getByText(/Average Temperature:/)).toBeInTheDocument();
  expect(within(parentDiv).getByText(/13.0°C/)).toBeInTheDocument();
});

test("calculates the correct temperature difference", async () => {
  render(<App />);

  // Find the input field and the button
  const inputElement = screen.getByPlaceholderText("Enter location...");
  const buttonElement = screen.getByText("Get Weather");

    // Simulate user typing a city name and cliking button
  await act(async () => {
    fireEvent.change(inputElement, { target: { value: "London" } });
    fireEvent.click(buttonElement);
  });

  // Wait for the results section to appear and locate it
    const resultsSection = await screen.findByText(/Weather Comparison for:/);
    const parentDiv = resultsSection.closest(".results");
  
  // Verify that "Temperature Difference" text is displayed within the results section
  expect(within(parentDiv).getByText(/Temperature Difference:/)).toBeInTheDocument();

  // Find all occurrences of "2.0°C" and ensure at least one is present in the results
  const tempElements = within(parentDiv).getAllByText(/2.0°C/);
  expect(tempElements.length).toBeGreaterThan(0); // Varmista, että löytyy ainakin yksi
});

test("displays temperature results after clicking button", async () => {
  render(<App />);

  const inputElement = screen.getByPlaceholderText("Enter location...");
  const buttonElement = screen.getByText("Get Weather");

  await act(async () => {
    fireEvent.change(inputElement, { target: { value: "London" } });
    fireEvent.click(buttonElement);
  });

  expect(await screen.findByText(/OpenWeatherMap Temperature:/)).toBeInTheDocument();
  expect(await screen.findByText(/WeatherAPI Temperature:/)).toBeInTheDocument();
  expect(await screen.findByText(/Temperature Difference:/)).toBeInTheDocument();
  expect(await screen.findByText(/Average Temperature:/)).toBeInTheDocument();
});

test("shows error if location is not provided", async () => {
  render(<App />);

  const buttonElement = screen.getByText("Get Weather");

  await act(async () => {
    fireEvent.click(buttonElement);
  });

  expect(await screen.findByText(/Location is required/)).toBeInTheDocument();
});

test("shows error if the entered location is not found", async () => {
  render(<App />);

  const inputElement = screen.getByPlaceholderText("Enter location...");
  const buttonElement = screen.getByText("Get Weather");

  await act(async () => {
    fireEvent.change(inputElement, { target: { value: "UnknownCity123" } });
    fireEvent.click(buttonElement);
  });

  expect(await screen.findByText(new RegExp(`Nothing found for city "${"UnknownCity123"}", please check the spelling`))).toBeInTheDocument();

});

test("clears previous results when user starts typing", async () => {
  render(<App />);

  const inputElement = screen.getByPlaceholderText("Enter location...");
  const buttonElement = screen.getByText("Get Weather");

  // Simulate typing a city and fetching weather data
  await act(async () => {
    fireEvent.change(inputElement, { target: { value: "London" } });
    fireEvent.click(buttonElement);
  });

  // Wait for results to appear
  await screen.findByText(/Weather Comparison for:/);
  expect(screen.getByText(/OpenWeatherMap Temperature:/)).toBeInTheDocument();

  // Simulate typing a new city
  fireEvent.change(inputElement, { target: { value: "New York" } });

  // Ensure previous results are removed
  expect(screen.queryByText(/Weather Comparison for:/)).not.toBeInTheDocument();
  expect(screen.queryByText(/OpenWeatherMap Temperature:/)).not.toBeInTheDocument();
});

test("displays error message below the input field", async () => {
  render(<App />);

  const inputElement = screen.getByPlaceholderText("Enter location...");
  const buttonElement = screen.getByText("Get Weather");

  // Click the button without entering a location
  await act(async () => {
    fireEvent.click(buttonElement);
  });

  // Check if the error message appears
  const errorMessage = await screen.findByText(/Location is required/);
  expect(errorMessage).toBeInTheDocument();

  // Ensure the error message is directly below the input field
  expect(errorMessage.compareDocumentPosition(inputElement)).toBe(4); // 4 means 'following'
});
