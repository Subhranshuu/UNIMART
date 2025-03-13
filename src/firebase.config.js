// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAskeignJz-Y5o1j_4yuTzCR34E-FnwAvg",
  authDomain: "marketopolis-522e4.firebaseapp.com",
  projectId: "marketopolis-522e4",
  storageBucket: "marketopolis-522e4.appspot.com",
  messagingSenderId: "891863408551",
  appId: "1:891863408551:web:a0159eec1fcd295b3f2082"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage =getStorage(app); 

export default app;
