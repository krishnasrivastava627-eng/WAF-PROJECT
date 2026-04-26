const Log = require("../models/log");
const Rule = require("../models/Rule");
const { detectAttack } = require("../utils/ruleEngine");
const { aiCheck } = require("../utils/aiEngine");

// 📊 Stats API
exports.getStats = async (req, res) => {
  try {
    const logs = await Log.find();

    const total = logs.length;
    const blocked = logs.filter(log => log.status === "Blocked").length;
    const allowed = logs.filter(log => log.status === "Allowed").length;
    const attacks = logs.filter(log => log.attackType !== "None").length;

    res.json({ total, blocked, allowed, attacks });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 📜 Logs API
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });

    const formatted = logs.map(log => ({
      ip: log.ip || "Unknown",
      attack: log.attackType || "None",
      time: new Date(log.createdAt).toLocaleString()
    }));

    res.json(formatted);

  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
};


// 🔥 Main WAF Logic
exports.checkRequest = async (req, res) => {
  try {
    // ✅ FIX: use payload instead of input
    const { ip, payload } = req.body;
    const input = payload || "";

    // ❌ Empty input check
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
    } else {
      // 🧠 simple AI check (keep as-is, no change)
      const aiResult = aiCheck(input);

      if (aiResult.suspicious) {
        status = "Blocked";
        reason = aiResult.reason;
        attackType = "Anomaly";

        const exists = await Rule.findOne({ pattern: input });
        if (!exists) {
          await Rule.create({ pattern: input });
        }
      }
    }

    // 📊 Save log
    await Log.create({
      ip: ip || req.ip,
      attackType,
      status,
      reason
    });

    // ✅ Response
    res.json({ status, reason, attackType });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
