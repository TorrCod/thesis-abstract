import { initializeApp } from "firebase-admin";
import { firebaseConfig } from "./firebase";

const adminApp = initializeApp(firebaseConfig);

export const admin_deleteUser = async (email: string) => {
  const auth = adminApp.auth();
  const uid = (await auth.getUserByEmail(email)).uid;
  await auth.deleteUser(uid);
};
