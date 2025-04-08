
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, remove } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCeJcHSIGVRmz71X7AoSjc76W66W8KnVKQ",
  authDomain: "react-fb-project-60aa4.firebaseapp.com",
  projectId: "react-fb-project-60aa4",
  storageBucket: "react-fb-project-60aa4.firebasestorage.app",
  messagingSenderId: "348350636332",
  appId: "1:348350636332:web:f4503a74af59b9aadecc89",
  measurementId: "G-6W8HWJHSWG",
  };
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, ref, set, get, child, remove, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };