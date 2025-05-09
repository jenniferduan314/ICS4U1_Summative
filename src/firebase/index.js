import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD-Je1pndGDm42xGRyNGSGHFKbtk8KVMIQ",
    authDomain: "ics4u-c5f57.firebaseapp.com",
    projectId: "ics4u-c5f57",
    storageBucket: "ics4u-c5f57.firebasestorage.app",
    messagingSenderId: "426663380012",
    appId: "1:426663380012:web:b1daf8a5a24f3a8ae3fd89"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };