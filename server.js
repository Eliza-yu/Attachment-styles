const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// Database setup
const db = new sqlite3.Database("./quiz.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      answers TEXT,
      result TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Save response
app.post("/submit", (req, res) => {
  const { answers, result } = req.body;

  db.run(
    `INSERT INTO responses (answers, result) VALUES (?, ?)`,
    [JSON.stringify(answers), result],
    function (err) {
      if (err) {
        res.status(500).send("Error saving data.");
      } else {
        res.send("Response saved anonymously 💗");
      }
    }
  );
});

// View poll results (ONLY YOU)
app.get("/admin", (req, res) => {
  db.all("SELECT result, COUNT(*) as count FROM responses GROUP BY result", (err, rows) => {
    if (err) {
      res.status(500).send("Error retrieving data.");
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

