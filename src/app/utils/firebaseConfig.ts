// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvYAR62pOtrTfs9IRXTAMlwhixzlxfJZo",
  authDomain: "trello-clone-mvp.firebaseapp.com",
  projectId: "trello-clone-mvp",
  storageBucket: "trello-clone-mvp.firebasestorage.app",
  messagingSenderId: "737415636352",
  appId: "1:737415636352:web:0080c66a40b7c568524d65",
  measurementId: "G-V18JNBNJ94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };