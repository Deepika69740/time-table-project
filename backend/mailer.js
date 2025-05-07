// backend/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendTaskExpiryEmail = async (toEmail, taskName, dueDate) => {
  const mailOptions = {
    from: `"Task Scheduler" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Your Task "${taskName}" Has Expired`,
    text: `Hello,\n\nYour task "${taskName}" was due on ${dueDate} and is now marked as expired.\n\n- Time Table Scheduler`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

module.exports = sendTaskExpiryEmail;
