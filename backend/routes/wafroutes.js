const express = require("express");
const router = express.Router();

// import functions
const { getStats, getLogs } = require("../controllers/wafControllers");

// routes
router.get("/stats", getStats);
router.get("/logs", getLogs);

module.exports = router;