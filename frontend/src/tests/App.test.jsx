import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import App from "../App";

// Mocking the fetch API call
global.fetch = jest.fn((url) =>
  Promise.resolve({
    ok: url.includes("UnknownCity123") ? false : true, // Simuloi virheen tuntemattomalle kaupungille
    json: () =>
      Promise.resolve(
        url.includes("UnknownCity123")
          ? { error: "Location not found" }
          : { location: "London", openweather_temp: "12.0", weatherapi_temp: "14.0" }
      ),
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
  expect(await screen.findByText(/Weather Comparison for:/)).toBeInTheDocument();
});

test("fetches and displays weather data from backend", async () => {
  render(<App />);

  // Enter a city name into the input field and click button
  const inputElement = screen.getByPlaceholderText("Enter location...");
  const buttonElement = screen.getByText("Get Weather");

  await act(async () => {
    fireEvent.change(inputElement, { target: { value: "London" } });
    fireEvent.click(buttonElement);
  });

  // Wait for the API response and check if data is displayed correctly
  await waitFor(() =>
    expect(screen.getByText("Weather Comparison for: London")).toBeInTheDocument()
  );
  expect(screen.getByText("OpenWeatherMap Temperature: 12.0°C")).toBeInTheDocument();
  expect(screen.getByText("WeatherAPI Temperature: 14.0°C")).toBeInTheDocument();
});

test("calculates the correct average temperature", async () => {
  render(<App />);

  const inputElement = screen.getByPlaceholderText("Enter location...");
  const buttonElement = screen.getByText("Get Weather");

  await act(async () => {
    fireEvent.change(inputElement, { target: { value: "London" } });
    fireEvent.click(buttonElement);
  });

  expect(await screen.findByText(/Average Temperature: 13.0°C/)).toBeInTheDocument();
});

test("calculates the correct temperature difference", async () => {
  render(<App />);

  const inputElement = screen.getByPlaceholderText("Enter location...");
  const buttonElement = screen.getByText("Get Weather");

  await act(async () => {
    fireEvent.change(inputElement, { target: { value: "London" } });
    fireEvent.click(buttonElement);
  });

  expect(await screen.findByText(/Temperature Difference: 2.0°C/)).toBeInTheDocument();
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
