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
  uploadString,
} from "firebase/storage";
import { signIn as nextSignIn } from "next-auth/react";

export const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "{}"
);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firebaseStorage = getStorage(app);

console.log("emulator connected");
connectAuthEmulator(auth, "http://localhost:9099");

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const tokenId = await userCredential.user.getIdToken();
  await nextSignIn("credentials", { callbackUrl: "/dashboard" }, { tokenId });
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
  return res;
};

export const uploadProfile = async (dataUrl: string, uid: string) => {
  const storageRef = ref(firebaseStorage, "profile-pictures/" + uid);
  const { ref: fileRef } = await uploadString(storageRef, dataUrl, "data_url");
  const url = await getDownloadURL(fileRef);
  return url;
};
