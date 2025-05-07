// backend/server.js
const express = require("express");
const cron = require("node-cron");
const checkExpiredTasks = require("./taskChecker");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("✅ Task Scheduler Backend is running!");
});

// 🕒 Run every minute
cron.schedule("* * * * *", () => {
  console.log("🔍 [CRON] Checking for expired tasks at", new Date().toISOString());
  checkExpiredTasks();
});

app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
