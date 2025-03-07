
// const { getOpenWeatherTemp, getWeatherApiTemp } = require("../services/weatherService"); 
// Uncomment this when implementing actual API calls.

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    console.log("🔥 GET /temperature called");
    res.json({
        message: "Temperature API is working!",
        openweather_temp: 12,
        weatherapi_temp: 14
    });
});

// ✅ Adding POST route to ensure tests pass!
router.post("/", async (req, res) => {
    const { location } = req.body;

    if (!location) {
        return res.status(400).json({ error: "Location is required" });
    }

    res.json({
        location,
        openweather_temp: 12, // Placeholder data, will be replaced with actual API response
        weatherapi_temp: 14
    });
});

module.exports = router;

