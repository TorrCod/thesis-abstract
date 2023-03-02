import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZlCW7q74uaLWyQs6Nzf8CGduhQpZNcs8",
  authDomain: "thesis-abstract-account.firebaseapp.com",
  projectId: "thesis-abstract-account",
  storageBucket: "thesis-abstract-account.appspot.com",
  messagingSenderId: "172867120828",
  appId: "1:172867120828:web:497eabd0f6c44af7e32ab9",
  measurementId: "G-E8FRF13T22",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const signIn = async (email: string, password: string) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
};
