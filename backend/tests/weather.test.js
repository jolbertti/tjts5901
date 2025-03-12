const axios = require("axios");
const { getOpenWeatherTemp, getWeatherApiTemp } = require("../src/services/weatherService"); // Adjust path if needed

// Mock axios
jest.mock("axios");

describe("Weather Service", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  it("should return temperature from OpenWeather API", async () => {
    const city = "Helsinki";
    const mockTemp = 15;

    // Mock axios.get for OpenWeather
    axios.get.mockResolvedValue({
      data: {
        main: {
          temp: mockTemp
        }
      }
    });

    const temp = await getOpenWeatherTemp(city);

    expect(temp).toBe(mockTemp);
    expect(axios.get).toHaveBeenCalledWith(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
  });

  it("should return temperature from WeatherAPI", async () => {
    const city = "Helsinki";
    const mockTemp = 14;

    // Mock axios.get for WeatherAPI
    axios.get.mockResolvedValue({
      data: {
        current: {
          temp_c: mockTemp
        }
      }
    });

    const temp = await getWeatherApiTemp(city);

    expect(temp).toBe(mockTemp);
    expect(axios.get).toHaveBeenCalledWith(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHERAPI_KEY}&q=${city}`
    );
  });

  it("should throw an error if OpenWeather API fails", async () => {
    const city = "Helsinki";

    // Mock axios.get to simulate failure
    axios.get.mockRejectedValue(new Error("API request failed"));

    await expect(getOpenWeatherTemp(city)).rejects.toThrow("API request failed");
  });

  it("should throw an error if WeatherAPI fails", async () => {
    const city = "Helsinki";

    // Mock axios.get to simulate failure
    axios.get.mockRejectedValue(new Error("API request failed"));

    await expect(getWeatherApiTemp(city)).rejects.toThrow("API request failed");
  });
});
