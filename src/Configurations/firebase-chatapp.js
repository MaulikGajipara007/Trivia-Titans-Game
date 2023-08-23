// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD10pg5IVYs2VSR-okv3foKYBVxecErcMY",
  authDomain: "csci-5410-f23-390901.firebaseapp.com",
  projectId: "csci-5410-f23-390901",
  storageBucket: "csci-5410-f23-390901.appspot.com",
  messagingSenderId: "25464161510",
  appId: "1:25464161510:web:82eb43cb1fd4fabadca727",
  measurementId: "G-D6NBV8BRVE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);