
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyAS_FlOlZxsvLYGrf-8SLdkvDezpjRsQJw",
  authDomain: "ecom-ad5a6.firebaseapp.com",
  projectId: "ecom-ad5a6",
  storageBucket: "ecom-ad5a6.appspot.com",
  messagingSenderId: "222813097997",
  appId: "1:222813097997:web:18e70d79aa25867a0f8544"
};
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app);

export { fireDB, auth }

