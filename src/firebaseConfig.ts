// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  browserLocalPersistence,
  setPersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configurações via .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// -----------------------------------------------------
// 🔥 APP PRINCIPAL (onde o ADM e o motorista fazem login)
// -----------------------------------------------------
export const firebaseApp = initializeApp(firebaseConfig);

// Auth principal
export const auth = getAuth(firebaseApp);

// 🔥 Persistência REAL de sessão (ADM e motorista continuam logados)
setPersistence(auth, browserLocalPersistence);

// Firestore
export const db = getFirestore(firebaseApp);

// -----------------------------------------------------
// 🔥 APP SECUNDÁRIO (para criar usuários sem trocar sessão)
// -----------------------------------------------------
export const firebaseAppAdmin = initializeApp(firebaseConfig, "adminApp");

// Auth secundário (não interfere na sessão atual)
export const authAdmin = getAuth(firebaseAppAdmin);
