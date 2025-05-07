// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
// import { getAuth } from "firebase/auth";
// import { get, ref, set, update, remove, onValue } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyCeJcHSIGVRmz71X7AoSjc76W66W8KnVKQ",
//   authDomain: "react-fb-project-60aa4.firebaseapp.com",
//   databaseURL: "https://react-fb-project-60aa4-default-rtdb.firebaseio.com",
//   projectId: "react-fb-project-60aa4",
//   storageBucket: "react-fb-project-60aa4.appspot.com",
//   messagingSenderId: "348350636332",
//   appId: "1:348350636332:web:f4503a74af59b9aadecc89"
// };

// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
// const auth = getAuth(app);
// export { database, auth };
// export { ref, push, onValue, update, remove, set,get } from "firebase/database";
// // export { database, ref, set, update, remove, onValue, get };

// export { 
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut 
// } from "firebase/auth";


import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { get, ref, set, update, remove, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCeJcHSIGVRmz71X7AoSjc76W66W8KnVKQ",
  authDomain: "react-fb-project-60aa4.firebaseapp.com",
  databaseURL: "https://react-fb-project-60aa4-default-rtdb.firebaseio.com",
  projectId: "react-fb-project-60aa4",
  storageBucket: "react-fb-project-60aa4.appspot.com",
  messagingSenderId: "348350636332",
  appId: "1:348350636332:web:f4503a74af59b9aadecc89"
};
// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json");
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
// const db = admin.firestore();
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
export { database, auth };
export { ref, push, onValue, update, remove, set,get } from "firebase/database";
// export { database, ref, set, update, remove, onValue, get };

// module.exports = db;
export { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} from "firebase/auth";