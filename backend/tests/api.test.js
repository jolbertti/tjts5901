const request = require("supertest");
const express = require("express");
const temperatureRoutes = require("../src/routes/temperature");

const app = express();
app.use(express.json());
app.use("/temperature", temperatureRoutes);

describe("Temperature API", () => {
    test("POST /temperature should return temperature data", async () => {
        const response = await request(app)
            .post("/temperature")
            .send({ location: "London" });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("location", "London");
        expect(response.body).toHaveProperty("openweather_temp");
        expect(response.body).toHaveProperty("weatherapi_temp");
    });

    test("POST /temperature without location should return error", async () => {
        const response = await request(app).post("/temperature").send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Location is required" });
    });
});
