// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfPDRxPiaw0enOYaW5MmPXMI6fED6RmzY",
  authDomain: "travel-planner-33316.firebaseapp.com",
  projectId: "travel-planner-33316",
  storageBucket: "travel-planner-33316.firebasestorage.app",
  messagingSenderId: "681961739218",
  appId: "1:681961739218:web:49cc5b5ded805880242e0b",
  measurementId: "G-6BLRC66KK7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
