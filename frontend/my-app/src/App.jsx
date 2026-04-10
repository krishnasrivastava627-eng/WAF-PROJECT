import React, { useState } from "react";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Stats
  const stats = {
    total: 120,
    blocked: 30,
    allowed: 90,
    attacks: 30
  };

  // Recent logs
  const logs = [
    { ip: "192.168.1.1", attack: "SQL Injection", time: "10:30" },
    { ip: "10.0.0.2", attack: "XSS", time: "10:32" },
    { ip: "172.16.0.5", attack: "Brute Force", time: "10:35" }
  ];

  // Attack distribution
  const attackDistribution = [
    { type: "SQL_INJECTION", count: 12847 },
    { type: "XSS_ATTACK", count: 8923 },
    { type: "PATH_TRAVERSAL", count: 6241 },
    { type: "DDOS_FLOOD", count: 5102 },
    { type: "BOT_SCRAPING", count: 4089 }
  ];

  const maxCount = Math.max(...attackDistribution.map(a => a.count));

  return (
  <div className={darkMode ? "app dark" : "app"}>

    {/* Sidebar */}
    <div className="sidebar">
      <h2>🛡️ WAF</h2>
      <ul>
        <li>Dashboard</li>
        <li>Logs</li>
        <li>Analytics</li>
      </ul>

      <button onClick={() => setDarkMode(!darkMode)}>
        🌙 Toggle Mode
      </button>
    </div>

    {/* Main Content */}
    <div className="content">
      <div className="main-content">

        <h1>Security Dashboard</h1>

        {/* Cards */}
        <div className="cards">
          <div className="card total">Total {stats.total}</div>
          <div className="card blocked">Blocked {stats.blocked}</div>
          <div className="card allowed">Allowed {stats.allowed}</div>
          <div className="card attacks">Attacks {stats.attacks}</div>
        </div>

        {/* Recent Attacks Table */}
        <div className="table-container">
          <h2>Recent Attacks</h2>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>IP</th>
                  <th>Attack</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.ip}</td>

                    <td
                      className={
                        log.attack === "SQL Injection"
                          ? "danger"
                          : log.attack === "XSS"
                          ? "warning"
                          : ""
                      }
                    >
                      {log.attack}
                    </td>

                    <td>{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🔥 Attack Distribution BELOW */}
        <div className="attack-box">
          <h2>ATTACK_DISTRIBUTION</h2>

          {attackDistribution.map((attack, index) => {
            const percent = (attack.count / maxCount) * 100;

            return (
              <div key={index} className="attack-item">

                <div className="attack-header">
                  <span>{attack.type}</span>
                  <span>{attack.count.toLocaleString()}</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  </div>
);
}

export default App;