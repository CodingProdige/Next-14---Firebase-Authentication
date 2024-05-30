// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhVf9A0P61Nuwpv3BJO9KeRVePHWPSMCg",
  authDomain: "linkapp-a5ccb.firebaseapp.com",
  projectId: "linkapp-a5ccb",
  storageBucket: "linkapp-a5ccb.appspot.com",
  messagingSenderId: "940381602817",
  appId: "1:940381602817:web:bbd1b4b38ad0b1ef1dec00"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

