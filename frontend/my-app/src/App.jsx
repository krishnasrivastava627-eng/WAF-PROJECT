import React, { useState } from "react";
import "./App.css";
function App() {
  const [darkMode, setDarkMode] = useState(false);

 
  const stats = {
    total: 120,
    blocked: 30,
    allowed: 90,
    attacks: 30
  };

  const logs = [
    { ip: "192.168.1.1", attack: "SQL Injection", time: "10:30" },
    { ip: "10.0.0.2", attack: "XSS", time: "10:32" },
    { ip: "172.16.0.5", attack: "Brute Force", time: "10:35" }
  ];

  return (
    <div className={darkMode ? "app dark" : "app"}>

      <div className="sidebar">
        <h2>🛡️SUDARSHAN</h2>
        <ul>
          <li>Dashboard</li>
          <li>Logs</li>
          <li>Analytics</li>
        </ul>

        <button onClick={() => setDarkMode(!darkMode)}>
          🌙 Toggle Mode
        </button>
      </div>

      
      <div className="content">
        <div className="main-content">

          <h1>Security Dashboard</h1>

      
          <div className="cards">
            <div className="card total">Total {stats.total}</div>
            <div className="card blocked">Blocked {stats.blocked}</div>
            <div className="card allowed">Allowed {stats.allowed}</div>
            <div className="card attacks">Attacks {stats.attacks}</div>
          </div>

      
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

        </div>
      </div>
    </div>
  );
}

export default App;