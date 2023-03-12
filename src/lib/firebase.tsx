import { UserDetails } from "@/context/types.d";
import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";

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
export const auth = getAuth(app);
export const firebaseStorage = getStorage(app);

// Connect to emulator
if (location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

export const signIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (details: UserDetails) => {
  const res = await createUserWithEmailAndPassword(
    auth,
    details.email,
    details.password!
  );
  updateProfile(res.user, {
    displayName: details.userName,
  });
  return res.user.uid;
};

export const uploadProfile = async (dataUrl: string, uid: string) => {
  try {
    const storageRef = ref(firebaseStorage, "profile-pictures/" + uid);
    const { ref: fileRef } = await uploadString(
      storageRef,
      dataUrl,
      "data_url"
    );
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (e) {
    console.error(e);
  }
};
