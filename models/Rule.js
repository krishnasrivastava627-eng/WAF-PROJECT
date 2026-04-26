const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema({
    pattern: {
        type: String,
        required: true,
        unique: true,   // 🔥 prevents duplicates
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model("Rule", ruleSchema);