Feature: Weather service

  Scenario: Fetching temperature from OpenWeather API
    Given the OpenWeather API is available
    When I request the temperature for "Helsinki"
    Then I should receive the temperature from OpenWeather as 15

  Scenario: Fetching temperature from WeatherAPI
    Given the WeatherAPI is available
    When I request the temperature for "Helsinki"
    Then I should receive the temperature from WeatherAPI as 14

  Scenario: OpenWeather API fails
    Given the OpenWeather API is unavailable
    When I request the temperature for "Helsinki"
    Then I should receive an error from OpenWeather API

  Scenario: WeatherAPI fails
    Given the WeatherAPI is unavailable
    When I request the temperature for "Helsinki"
    Then I should receive an error from WeatherAPI