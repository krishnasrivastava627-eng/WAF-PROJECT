//const Log = require("./models/Log");
const rule = require('../models/Rule');
const { detectAttack } = require("../utils/ruleEngine");
const { aiCheck } = require("../utils/aiEngine");
exports.getStats = (req, res) => {
  res.json({
    total: 120,
    blocked: 30,
    allowed: 90,
    attacks: 30
  });
};

exports.getLogs = (req, res) => {
  res.json([
    { ip: "192.168.1.1", attack: "SQL Injection", time: "10:30" },
    { ip: "10.0.0.2", attack: "XSS", time: "10:32" }
  ]);
};

// 🔥 Check Request (Main WAF Logic)
exports.checkRequest = async (req, res) => {
    try {
        const input = req.body?.input || "";

        // ❌ Empty input block
        if (!input.trim()) {
            return res.json({
                status: "Blocked",
                reason: "Empty input",
                attackType: "Invalid"
            });
        }

        let status = "Allowed";
        let reason = "Normal";
        let attackType = "None";

        // 🛡️ Rule-based detection
        const ruleResult = detectAttack(input);

        if (ruleResult.detected) {
            status = "Blocked";
            reason = ruleResult.reason;
            attackType = ruleResult.type;
        } 
        else {
            // 🧠 AI-based detection
            const aiResult = aiCheck(input);

            if (aiResult.suspicious) {
                status = "Blocked";
                reason = aiResult.reason;
                attackType = "Anomaly";

                // 🔁 Adaptive Rule Generation (avoid duplicates)
                const exists = await Rule.findOne({ pattern: input });
                if (!exists) {
                    await Rule.create({ pattern: input });
                }
            }
        }

        // 📊 Save log
        await Log.create({ input, status, reason, attackType });

        // 📤 Response
        res.json({ status, reason, attackType });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// 📊 Get Logs API
exports.getLogs = async (req, res) => {
    try {
        const logs = await Log.find().sort({ createdAt: -1 });
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};