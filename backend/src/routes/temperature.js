const express = require("express");
const { getOpenWeatherTemp, getWeatherApiTemp } = require("../services/weatherService");

const router = express.Router();

router.get("/", async (req, res) => {});

module.exports = router;