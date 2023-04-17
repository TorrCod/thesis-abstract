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
  connectStorageEmulator,
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

if (process.env.NODE_ENV === "development") {
  console.log("emulator connected");
  connectAuthEmulator(auth, "http://localhost:9099");
  process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.EMULATOR_HOST;
  process.env.FIREBASE_STORAGE_EMULATOR_HOST =
    process.env.STORAGE_EMULATOR_HOST;
  connectStorageEmulator(firebaseStorage, "localhost", 9199);
}

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

export const uploadAbstract = async (
  dataUrlList: string[],
  folderId: string
) => {
  const abstractUrlList: string[] = [];
  for (const dataUrl of dataUrlList) {
    const storageRef = ref(
      firebaseStorage,
      `abstract/${folderId}/${dataUrlList.indexOf(dataUrl)}`
    );
    const { ref: fileRef } = await uploadString(
      storageRef,
      dataUrl,
      "data_url"
    );
    const url = await getDownloadURL(fileRef);
    abstractUrlList.push(url);
  }
  return abstractUrlList;
};
