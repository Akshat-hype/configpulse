const express = require("express");
const router = express.Router();
const { fetchConfig } = require("../../controllers/config.controller");

// GET /api/config?clientId=enterprise-client-1&environment=production&location=india
router.get("/", fetchConfig);

module.exports = router;