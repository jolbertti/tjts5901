const express = require("express");
const { getOpenWeatherTemp, getWeatherApiTemp } = require("../services/weatherService");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const city = req.query.city;
        if (!city) return res.status(400).json({ error: "City parameter is required" });

        const [temp1, temp2] = await Promise.all([
            getOpenWeatherTemp(city),
            getWeatherApiTemp(city),
        ]);

        if (temp1 === null && temp2 === null) {
            return res.status(404).json({ error: `Nothing found for city "${city}", please check spelling` });
        }

        res.json({ city, openweather_temp: temp1, weatherapi_temp: temp2 });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch temperature data" });
    }
});

module.exports = router;
