// backend/server.js
const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
const nodemailer = require("nodemailer");
const checkExpiredTasks = require("./taskChecker");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("✅ Task Scheduler Backend is running!");
});

app.post('/send-email', async (req, res) => {
  console.log("Received email request:", req.body);
  const { user_name, task_name, task_description, from_time, to_time, to_email } = req.body;
  
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to_email,
      subject: `New Task: ${task_name}`,
      text: `
Hello ${user_name},

You have a new task:
- Name: ${task_name}
- Description: ${task_description}
- From: ${from_time}
- To: ${to_time}

Regards,
Your Task Manager
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// 🕒 Run every minute
cron.schedule("* * * * *", (req,res) => {
  console.log("🔍 [CRON] Checking for expired tasks at", new Date().toISOString());
  checkExpiredTasks();
  res.send("🔍 [CRON] Checking for expired tasks");
});

app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
