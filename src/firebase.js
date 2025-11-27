import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ← ADICIONAR
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyD1Zfy2wQMpR7fCCyEfLH9WEqABsXVpSVI",
  authDomain: "alugaai-2dd42.firebaseapp.com",
  projectId: "alugaai-2dd42",
  storageBucket: "alugaai-2dd42.firebasestorage.app",
  messagingSenderId: "124566430206",
  appId: "1:124566430206:web:ae4cb4901fd102b1c3e0af"
};

const app = initializeApp(firebaseConfig);

// Auth
let auth;
if (Platform.OS === 'web') {
  const { getAuth } = require("firebase/auth");
  auth = getAuth(app);
} else {
  const { initializeAuth, getReactNativePersistence } = require("firebase/auth");
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app); 