const express = require("express");
const router = express.Router();

const { checkRequest, getLogs } = require("../controllers/wafControllers");

// route for checking input
router.post("/check", checkRequest);

// route for getting logs
router.get("/logs", getLogs);

module.exports = router;