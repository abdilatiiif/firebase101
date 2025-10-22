import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1I_rzo5ene_a2I2hDAz_-eRRGzgTwiL8",
  authDomain: "newsland-6c263.firebaseapp.com",
  projectId: "newsland-6c263",
  storageBucket: "newsland-6c263.firebasestorage.app",
  messagingSenderId: "683787085283",
  appId: "1:683787085283:web:22882efdd7ec4b479cacd6",
  measurementId: "G-3S449XEXYR",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
