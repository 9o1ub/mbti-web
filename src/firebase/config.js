// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHa6AI5NcPMYwgfd8egzxdjzellp7h4yw",
  authDomain: "mbti-b2846.firebaseapp.com",
  projectId: "mbti-b2846",
  storageBucket: "mbti-b2846.firebasestorage.app",
  messagingSenderId: "651983170609",
  appId: "1:651983170609:web:69becc1b2a377bfda87910"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;