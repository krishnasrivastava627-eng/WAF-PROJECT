const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  ip: {
    type: String,
    default: "Unknown"
  },
  attackType: {
    type: String,
    default: "None"
  },
  status: {
    type: String,
    default: "Allowed"
  },
  reason: {
    type: String,
    default: "Normal"
  }
}, { timestamps: true });

module.exports = mongoose.model("Log", logSchema);