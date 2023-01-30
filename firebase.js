// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"; 
import {getAuth} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

import * as firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBp8nf0GeZLqO0O_c_3Sepb5V5KEqv0bKM",
  authDomain: "whatsapp-nextjs-c3510.firebaseapp.com",
  projectId: "whatsapp-nextjs-c3510",
  storageBucket: "whatsapp-nextjs-c3510.appspot.com",
  messagingSenderId: "120070269004",
  appId: "1:120070269004:web:366689f0b007e5791f6ce9",
  measurementId: "G-DJQQGH2V37"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const provider =  new GoogleAuthProvider();

export {db, auth, provider};

