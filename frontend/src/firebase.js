// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAT4ipk0PAcnIvntD8N-v1I6i2OcybtQtg",
  authDomain: "locamat-5d1e7.firebaseapp.com",
  projectId: "locamat-5d1e7",
  storageBucket: "locamat-5d1e7.firebasestorage.app",
  messagingSenderId: "396652887875",
  appId: "1:396652887875:web:046195e50e4c51a70e39f6",
  measurementId: "G-MN8EDDC5GY"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth = getAuth(app); // Initialisation du module Auth
export { auth };
