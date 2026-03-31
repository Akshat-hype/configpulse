const express = require("express");
const cors = require("cors");
const configRoutes = require("./api/routes/config.routes");
const healthRoutes = require("./api/routes/health.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/config", configRoutes);
app.use("/api/health", healthRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

module.exports = app;