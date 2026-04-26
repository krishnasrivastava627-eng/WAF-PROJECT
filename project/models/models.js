const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["Allowed", "Blocked"],
        required: true
    },
    reason: {
        type: String,
        default: "Normal"
    },
    attackType: {
        type: String,
        default: "None"
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model("Log", logSchema);