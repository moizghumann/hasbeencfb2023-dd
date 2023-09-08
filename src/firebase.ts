// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBM-q8VuNiGft2sJW4-yb9dgMgPnzxq3XA",
  authDomain: "has-been-pickem.firebaseapp.com",
  projectId: "has-been-pickem",
  storageBucket: "has-been-pickem.appspot.com",
  messagingSenderId: "538555395504",
  appId: "1:538555395504:web:035efb06086a104a92fa75",
  measurementId: "G-46V5XLJ9ZB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;
