import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCmk_eOKX02Tdn57eB7iYf2Bvv3YjF2KU",
  authDomain: "guessmymeal-nextjs.firebaseapp.com",
  projectId: "guessmymeal-nextjs",
  storageBucket: "guessmymeal-nextjs.firebasestorage.app",
  messagingSenderId: "434044431775",
  appId: "1:434044431775:web:fd85f2a5aaa2dffe05a1aa",
  measurementId: "G-H4V9LYK12K",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };
