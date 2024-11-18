// credenciales.js

// Importar las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Para Firestore
import { getAuth } from "firebase/auth"; // Para autenticación

// Configuración de tu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA0K7KLG952WidGpBfKE6dckU7posuPy8U",
  authDomain: "autoasiste-login-admin.firebaseapp.com",
  projectId: "autoasiste-login-admin",
  storageBucket: "autoasiste-login-admin.appspot.com",
  messagingSenderId: "656042079468",
  appId: "1:656042079468:web:6313cc0ec362be40a961c9",
};

// Inicializar Firebase
const appFirebase = initializeApp(firebaseConfig);

// Exportar servicios
const db = getFirestore(appFirebase); // Base de datos Firestore
const auth = getAuth(appFirebase); // Autenticación

export { db, auth }; // Exportación nombrada
export default appFirebase; // Exportación predeterminada
