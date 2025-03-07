Feature: Weather API

  Scenario: Get weather data for a location
    Given the weather API is running
    When I request the temperature for "London"
    Then I should receive temperature data
