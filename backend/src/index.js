require("dotenv").config();
const express = require("express");
const cors = require("cors");
const temperatureRoutes = require("./routes/temperature");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/temperature", temperatureRoutes);

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
