const { defineFeature, loadFeature } = require("jest-cucumber");
const request = require("supertest");
const express = require("express");
const temperatureRoutes = require("../src/routes/temperature");

const app = express();
app.use(express.json());
app.use("/temperature", temperatureRoutes);

const feature = loadFeature("./tests/features/weather.feature");

defineFeature(feature, test => {
    let response;

    test("Get weather data for a location", ({ given, when, then }) => {
        given("the weather API is running", () => {
            // This step just confirms that the API is up, handled by Jest setup
        });

        when("I request the temperature for \"London\"", async () => {
            response = await request(app)
                .post("/temperature")
                .send({ location: "London" });
        });

        then("I should receive temperature data", () => {
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("location", "London");
            expect(response.body).toHaveProperty("openweather_temp");
            expect(response.body).toHaveProperty("weatherapi_temp");
        });
    });
});
