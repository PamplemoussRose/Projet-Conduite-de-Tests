import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Ajout de l'importation pour Auth

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBp9_gzvtuz6WTjXkOImNwdSqL5YnIaDXw",
    authDomain: "locamat-7cf78.firebaseapp.com",
    projectId: "locamat-7cf78",
    storageBucket: "locamat-7cf78.appspot.com",
    messagingSenderId: "820273718810",
    appId: "1:820273718810:web:5a862a86421df367acd3a3",
    measurementId: "G-JZPD1JCF52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth = getAuth(app); // Initialisation du module Auth
export { auth };
