// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyhaRLEnKVJxYXl8huoUyIDeXSCsF8TYs",
  authDomain: "planer-9c3a6.firebaseapp.com",
  projectId: "planer-9c3a6",
  storageBucket: "planer-9c3a6.firebasestorage.app",
  messagingSenderId: "16677088322",
  appId: "1:16677088322:web:f57fe4c88c862fbc1711db",
  measurementId: "G-7R0GF3W1WP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // <-- вот эту строку экспортируем
export const auth = getAuth(app);
export { db };