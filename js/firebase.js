/* Firebase Initialization Module */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Firebase Configuration
// In a Vite environment, these can come from import.meta.env
const firebaseConfig = {
    apiKey: "AIzaSyBfsI78zPfHKvhIpBl0oxID3Dlkn3vGFhM",
    authDomain: "castro-92ccf.firebaseapp.com",
    projectId: "castro-92ccf",
    storageBucket: "castro-92ccf.firebasestorage.app",
    messagingSenderId: "533988144128",
    appId: "1:533988144128:web:62e4b15e8ed8695bff94e5",
    measurementId: "G-PSZ8BNYVTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let analytics = null;
try {
    analytics = getAnalytics(app);
} catch (e) {
    console.warn('[Firebase] Analytics blocked or failed to initialize.');
}

// Export for use in other modules
export {
    db, auth, provider, signInWithPopup, onAuthStateChanged, signOut,
    analytics, collection, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc, query, where, onSnapshot
};

// Global Window Hooks
window.castroDb = db;
window.castroAuth = auth;
window.castroAuth = auth;
window.googleProvider = provider;
window.signInWithPopup = signInWithPopup;
