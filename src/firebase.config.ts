import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMDh-ghlMRn4NSlBnuNL9OfSQvs8XYBJE",
  authDomain: "socials-cebf9.firebaseapp.com",
  projectId: "socials-cebf9",
  storageBucket: "socials-cebf9.appspot.com",
  messagingSenderId: "1008246979029",
  appId: "1:1008246979029:web:2964f41bf0629973a4a55c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseDb = getFirestore(app);
const auth = getAuth(app);

export {
  app,
  firebaseDb,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setDoc,
  doc,
  getDoc,
};
