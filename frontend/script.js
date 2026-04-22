const BASE_URL = "http://localhost:3000/api";

// Scroll navigation
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth"
  });
}

// Load dashboard data
async function loadDashboard() {
  try {
    const [statsRes, logsRes, attacksRes] = await Promise.all([
      fetch(`${BASE_URL}/stats`),
      fetch(`${BASE_URL}/logs`),
      fetch(`${BASE_URL}/attacks`)
    ]);

    const stats = await statsRes.json();
    const logs = await logsRes.json();
    const attackDistribution = await attacksRes.json();

    // Status
    const status = stats.attacks > 20 ? "⚠️ Under Attack" : "✅ System Safe";
    document.getElementById("status").innerText = status;

    // Time
    document.getElementById("lastUpdated").innerText =
      "Last Updated: " + new Date().toLocaleString();

    // Cards
    document.getElementById("cards").innerHTML = `
      <div class="card total">Total ${stats.total}</div>
      <div class="card blocked">Blocked ${stats.blocked}</div>
      <div class="card allowed">Allowed ${stats.allowed}</div>
      <div class="card attacks">Attacks ${stats.attacks}</div>
    `;

    // Logs
    document.getElementById("logCount").innerText = logs.length;
    renderLogs(logs);

    // Filter
    document.getElementById("filter").addEventListener("change", (e) => {
      const value = e.target.value;
      const filtered =
        value === "ALL"
          ? logs
          : logs.filter(log => log.attack === value);

      renderLogs(filtered);
    });

    // Top Attack
    const topAttack = attackDistribution.reduce((a, b) =>
      a.count > b.count ? a : b
    );

    document.getElementById("topAttack").innerText =
      "🔥 Most Frequent Attack: " + topAttack.type;

    // Attack Distribution
    renderAttackDistribution(attackDistribution);

  } catch (err) {
    console.error("Error:", err);
  }
}

// Render Logs
function renderLogs(data) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  data.forEach(log => {   // only latest 3 logs
    const row = document.createElement("tr");

   const attackClass =
  log.attack === "SQL Injection"
    ? "danger"
    : log.attack === "XSS"
    ? "warning"
    : log.attack === "Anomaly"
    ? "critical"
    : log.attack === "None"
    ? "safe"
    : "";

    row.innerHTML = `
      <td>${log.ip}</td>
      <td class="${attackClass}">${log.attack}</td>
      <td>${log.time}</td>
    `;

    tableBody.appendChild(row);
  });
}

// Render Attack Distribution
function renderAttackDistribution(data) {
  const attackBox = document.getElementById("attackBox");
  attackBox.innerHTML = "";

  const max = Math.max(...data.map(a => a.count));

  data.forEach(a => {
    const percent = (a.count / max) * 100;

    const div = document.createElement("div");
    div.className = "attack-item";

    div.innerHTML = `
      <div class="attack-header">
        <span>${a.type}</span>
        <span>${a.count.toLocaleString()}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>
    `;

    attackBox.appendChild(div);
  });
}

// Initial load
loadDashboard();

// Auto refresh (optional)
setInterval(loadDashboard, 5000);