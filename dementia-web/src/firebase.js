// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxYE_8uWnc5KN-kQG1FreXGdadTad6Rk",
  authDomain: "my-project-3d04c.firebaseapp.com",
  projectId: "my-project-3d04c",
  storageBucket: "my-project-3d04c.appspot.com",
  messagingSenderId: "432827528849",
  appId: "1:432827528849:web:f5ca5fefeb63b3b26ef130",
  measurementId: "G-MRB4YWLRDW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
