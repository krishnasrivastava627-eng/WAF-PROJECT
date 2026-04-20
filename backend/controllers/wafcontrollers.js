const Log = require("../models/Log");
const Rule = require("../models/Rule");
const { detectAttack } = require("../utils/ruleEngine");
const { aiCheck } = require("../utils/aiEngine");

// 📊 Stats API (can be dynamic later)
exports.getStats = async (req, res) => {
  try {
    const logs = await Log.find();

    const total = logs.length;

    const blocked = logs.filter(log => log.status === "Blocked").length;

    const allowed = logs.filter(log => log.status === "Allowed").length;

    const attacks = logs.filter(log => log.attackType !== "None").length;

    res.json({
      total,
      blocked,
      allowed,
      attacks
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 📜 Logs API (formatted for frontend)
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });

    const formatted = logs.map(log => ({
      ip: log.ip || "Unknown",
      attack: log.attackType || "None",
      time: new Date(log.createdAt).toLocaleTimeString()
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 📊 Attack Distribution API
exports.getAttacks = async (req, res) => {
  try {
    const logs = await Log.find();

    const map = {};

    logs.forEach(log => {
      const type = log.attackType || "UNKNOWN";
      map[type] = (map[type] || 0) + 1;
    });

    const result = Object.keys(map).map(key => ({
      type: key,
      count: map[key]
    }));

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 🔥 Main WAF Logic (creates logs)
exports.checkRequest = async (req, res) => {
  try {
    const input = req.body?.input || "";

    // ❌ Empty input
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

        // 🔁 Save new pattern (avoid duplicates)
        const exists = await Rule.findOne({ pattern: input });
        if (!exists) {
          await Rule.create({ pattern: input });
        }
      }
    }

    // 📊 Save log to DB
    await Log.create({
      ip: req.ip,
      attackType,
      status,
      reason
    });

    // 📤 Send response
    res.json({ status, reason, attackType });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};