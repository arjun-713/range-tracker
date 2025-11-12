import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// Replace these with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBC1eK_UefHliuiT2D3AHdTyi11HemFXKY",
  authDomain: "scooty-charge.firebaseapp.com",
  databaseURL: "https://scooty-charge-default-rtdb.firebaseio.com",
  projectId: "scooty-charge",
  storageBucket: "scooty-charge.firebasestorage.app",
  messagingSenderId: "1091617223931",
  appId: "1:1091617223931:web:155d5df6d60cebb5fcec5e",
  measurementId: "G-2Y8MR69FKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
