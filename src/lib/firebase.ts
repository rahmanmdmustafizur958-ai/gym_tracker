import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCoVvlMwbvIQmFr9UxNo3ngDZ4Zlwwjug4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gym-logger-8bd49.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gym-logger-8bd49",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gym-logger-8bd49.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "994667024600",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:994667024600:web:23b16c6233a3ccc26ac7ad",
};

// Initialize Firebase only once
let app;
if (!getApps().length) {
  // Try to initialize only if we have at least apiKey, to prevent build crash
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
  } else {
    // Dummy initialization for build-time SSR to prevent crashing
    app = initializeApp({ apiKey: 'dummy-key', projectId: 'dummy-project' });
  }
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
