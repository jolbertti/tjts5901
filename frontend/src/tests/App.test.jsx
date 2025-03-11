import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

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