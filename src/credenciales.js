// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0K7KLG952WidGpBfKE6dckU7posuPy8U",
  authDomain: "autoasiste-login-admin.firebaseapp.com",
  projectId: "autoasiste-login-admin",
  storageBucket: "autoasiste-login-admin.appspot.com",
  messagingSenderId: "656042079468",
  appId: "1:656042079468:web:6313cc0ec362be40a961c9"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;