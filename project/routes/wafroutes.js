const express = require("express");
const router = express.Router();

// import functions
const { getStats, getLogs, getAttacks, checkRequest } = require("../controllers/wafcontrollers");

// routes
router.get("/stats", getStats);
router.get("/logs", getLogs);
router.get("/attacks", getAttacks);   // 🔥 for analytics
router.post("/check", checkRequest);  // 🔥 to generate logs

module.exports = router;
