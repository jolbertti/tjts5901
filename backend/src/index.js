require("dotenv").config();
const express = require("express");
const cors = require("cors");
const temperatureRoutes = require("./routes/temperature");
const promClient = require('prom-client'); // Ajoutez cette dépendance dans package.json

const app = express();
const PORT = process.env.PORT || 5000;

// Prometheus setup
const register = new promClient.Registry();
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register });

// Add custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.5, 1, 5]
});
register.registerMetric(httpRequestDurationMicroseconds);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/temperature", temperatureRoutes);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Start server
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));