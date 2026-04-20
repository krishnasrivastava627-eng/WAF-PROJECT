// Stats
const stats = {
  total: 120,
  blocked: 30,
  allowed: 90,
  attacks: 30
};

// Logs
const logs = [
  { ip: "192.168.1.1", attack: "SQL Injection", time: "10:30" },
  { ip: "10.0.0.2", attack: "XSS", time: "10:32" },
  { ip: "172.16.0.5", attack: "Brute Force", time: "10:35" }
];

// Attack Distribution
const attackDistribution = [
  { type: "SQL_INJECTION", count: 12847 },
  { type: "XSS_ATTACK", count: 8923 },
  { type: "PATH_TRAVERSAL", count: 6241 },
  { type: "DDOS_FLOOD", count: 5102 },
  { type: "BOT_SCRAPING", count: 4089 }
];

// Render Cards
const cardsDiv = document.getElementById("cards");
cardsDiv.innerHTML = `
  <div class="card total">Total ${stats.total}</div>
  <div class="card blocked">Blocked ${stats.blocked}</div>
  <div class="card allowed">Allowed ${stats.allowed}</div>
  <div class="card attacks">Attacks ${stats.attacks}</div>
`;

// Render Table
const tableBody = document.getElementById("tableBody");

logs.forEach(log => {
  const row = document.createElement("tr");

  const attackClass =
    log.attack === "SQL Injection"
      ? "danger"
      : log.attack === "XSS"
      ? "warning"
      : "";

  row.innerHTML = `
    <td>${log.ip}</td>
    <td class="${attackClass}">${log.attack}</td>
    <td>${log.time}</td>
  `;

  tableBody.appendChild(row);
});

// Render Attack Distribution
const attackBox = document.getElementById("attackBox");

const maxCount = Math.max(...attackDistribution.map(a => a.count));

attackDistribution.forEach(a => {
  const percent = (a.count / maxCount) * 100;

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