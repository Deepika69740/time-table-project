// backend/firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://react-fb-project-60aa4-default-rtdb.firebaseio.com" 
});

const db = admin.firestore();
module.exports = db;
