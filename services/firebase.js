import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_idRo88LcOub8nCm7p7gvcLOkyYBRG2s",
  authDomain: "talas-2bbd7.firebaseapp.com",
  projectId: "talas-2bbd7",
  storageBucket: "talas-2bbd7.appspot.com",
  messagingSenderId: "608458232759",
  appId: "1:608458232759:web:83c3320c9e2baf694f0e32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth;
let db;

try {
  // Initialize Auth with persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });

  // Initialize Firestore
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { app, auth, db }; // Export app, auth, and db
