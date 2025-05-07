// // backend/taskChecker.js
// const admin = require("firebase-admin");
// const sendTaskExpiryEmail = require("./mailer");

// const db = admin.database();

// const checkExpiredTasks = async () => {
//   const usersRef = db.ref("users");

//   usersRef.once("value", (snapshot) => {
//     const users = snapshot.val();
//     const now = new Date();

//     for (const userId in users) {
//       const user = users[userId];
//       const email = user.email;
//       const tasks = user.tasks;

//       if (tasks) {
//         for (const taskId in tasks) {
//           const task = tasks[taskId];

//           const toTime = new Date(task.toTime);

//           if (!task.completed && toTime < now) {
//             // Send mail
//             sendTaskExpiryEmail(email, task.name, task.toTime);

//             // Optional: Mark task as completed or expired to avoid re-sending
//             const taskRef = db.ref(`users/${userId}/tasks/${taskId}`);
//             taskRef.update({ completed: true });
//             console.log(`✅ Sent email & marked task "${task.name}" as completed for ${email}`);
//           }
//         }
//       }
//     }
//   }, (error) => {
//     console.error("❌ Error fetching users:", error);
//   });
// };

// module.exports = checkExpiredTasks;

// backend/taskChecker.js

const admin = require("firebase-admin");
const sendTaskExpiryEmail = require("./mailer");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://react-fb-project-60aa4-default-rtdb.firebaseio.com" 
});

const db = admin.database();

const checkExpiredTasks = async () => {
  const usersRef = db.ref("users");

  usersRef.once("value", (snapshot) => {
    const users = snapshot.val();
    const now = new Date();

    for (const userId in users) {
      const user = users[userId];
      const email = user.email;
      const tasks = user.tasks;

      if (tasks) {
        for (const taskId in tasks) {
          const task = tasks[taskId];
          const toTime = new Date(task.toTime);

          if (!task.completed && toTime < now) {
            // ✅ Send Email Notification
            sendTaskExpiryEmail(email, task.name, task.toTime);

            // ✅ Mark task as completed to avoid duplicate emails
            const taskRef = db.ref(`users/${userId}/tasks/${taskId}`);
            taskRef.update({ completed: true });

            console.log(`✅ Email sent & task marked complete: "${task.name}" for ${email}`);
          }
        }
      }
    }
  }, (error) => {
    console.error("❌ Error fetching users:", error);
  });
};

module.exports = checkExpiredTasks;

