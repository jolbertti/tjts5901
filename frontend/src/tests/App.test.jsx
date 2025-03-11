import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";



test("renders the input field and button", () => {
  render(<App />);
  
  // Verify that the input field is rendered
  const inputElement = screen.getByPlaceholderText("Enter location...");
  expect(inputElement).toBeInTheDocument();
  
  // Verify that the button is rendered
  const buttonElement = screen.getByText("Get Weather");
  expect(buttonElement).toBeInTheDocument();
});