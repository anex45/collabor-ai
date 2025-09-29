// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBI3jOtIBr3EPq6hzLUgh5K9Om_kePtCys",
  authDomain: "collabor-ai-e3bc4.firebaseapp.com",
  projectId: "collabor-ai-e3bc4",
  storageBucket: "collabor-ai-e3bc4.firebasestorage.app",
  messagingSenderId: "248269952653",
  appId: "1:248269952653:web:c113e473a7d6d11069f4c4",
  measurementId: "G-RHVJLTXLV7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Analytics only in browser environment
export let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

