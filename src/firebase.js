// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCwOJ3krtZXl3Al8RoGWJSpyh7kCHJad8A",
  authDomain: "mydashboard-c8bd4.firebaseapp.com",
  projectId: "mydashboard-c8bd4",
  storageBucket: "mydashboard-c8bd4.appspot.com", // ✅ FIXED typo
  messagingSenderId: "1026141468003",
  appId: "1:1026141468003:web:6592a400f44d5f36148f56",
  measurementId: "G-DPVKYJEELR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
