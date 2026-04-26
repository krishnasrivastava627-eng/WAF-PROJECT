exports.aiCheck = (input) => {
    let score = 0;
    let reasons = [];

    // 🔹 Length check
    if (input.length > 100) {
        score += 1;
        reasons.push("Input too long");
    }

    // 🔹 Special characters
    if (/[^a-zA-Z0-9\s]/.test(input)) {
        score += 1;
        reasons.push("Contains special characters");
    }

    // 🔹 Suspicious symbols (higher weight)
    if (/[<>{};]/.test(input)) {
        score += 2;
        reasons.push("Suspicious symbols detected");
    }

    // 🔹 Malicious keywords
    const keywords = ["script", "select", "drop", "alert", "insert", "delete"];

    for (let word of keywords) {
        if (input.toLowerCase().includes(word)) {
            score += 2;
            reasons.push(`Keyword detected: ${word}`);
        }
    }

    // 🔹 Repeated characters (like attack patterns)
    if (/(.)\1{4,}/.test(input)) {
        score += 1;
        reasons.push("Repeated characters detected");
    }

    return {
        suspicious: score >= 3,   // 🔥 threshold increased
        reason: reasons.join(", ")
    };
};