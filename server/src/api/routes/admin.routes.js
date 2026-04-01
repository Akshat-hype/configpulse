const express = require("express");
const router = express.Router();
const { updateConfig } = require("../../controllers/admin.controller");

// POST /api/admin/config
router.post("/config", updateConfig);

module.exports = router;
