exports.detectAttack = (input) => {
    const rules = [
        { pattern: /<script.*?>/i, type: "XSS", reason: "Script tag detected" },
        { pattern: /onerror\s*=/i, type: "XSS", reason: "onerror event detected" },
        { pattern: /<img.*?>/i, type: "XSS", reason: "Image tag detected" },
        { pattern: /<iframe.*?>/i, type: "XSS", reason: "Iframe detected" },

        { pattern: /union\s+select/i, type: "SQL Injection", reason: "UNION SELECT detected" },
        { pattern: /or\s+1=1/i, type: "SQL Injection", reason: "OR 1=1 condition detected" },
        { pattern: /--/i, type: "SQL Injection", reason: "SQL comment detected" },
        { pattern: /drop\s+table/i, type: "SQL Injection", reason: "DROP TABLE detected" },

        { pattern: /\.\.\//i, type: "Path Traversal", reason: "Directory traversal detected" }
    ];

    for (let rule of rules) {
        if (rule.pattern.test(input)) {
            return {
                detected: true,
                type: rule.type,
                reason: rule.reason
            };
        }
    }

    return { detected: false };
};