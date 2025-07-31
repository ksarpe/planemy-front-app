import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgow86EH5CFjYyUKtp7S5ZrIrf_-l5Qco",
  authDomain: "budget-tracker-a96f3.firebaseapp.com",
  projectId: "budget-tracker-a96f3",
  storageBucket: "budget-tracker-a96f3.firebasestorage.app",
  messagingSenderId: "245825668299",
  appId: "1:245825668299:web:dc4c3c6d5b99d92b36474e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
