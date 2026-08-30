import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABD_nzNjk7zTDEwTTPtFjT_v8Y55dXN0k",
  authDomain: "meal-planner-2d0b7.firebaseapp.com",
  projectId: "meal-planner-2d0b7",
  storageBucket: "meal-planner-2d0b7.firebasestorage.app",
  messagingSenderId: "816815199789",
  appId: "1:816815199789:web:a239c676700c63797b4aa4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);