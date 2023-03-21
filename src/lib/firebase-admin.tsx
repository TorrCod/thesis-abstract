import * as admin from "firebase-admin";
import { firebaseConfig } from "./firebase";

const firebaseAdminInit = () => {
  try {
    const firebase_admin_config = {
      ...firebaseConfig,
      credential: admin.credential.cert(
        JSON.parse(process.env.ADMIN_CONFIG ?? "")
      ),
    };
    const adminApp = admin.initializeApp(firebase_admin_config, "admin-app");
    return adminApp;
  } catch (e) {
    if ((e as any).code === "app/duplicate-app") {
      return admin.app("admin-app");
    }
    throw new Error(e as any);
  }
};

export const admin_deleteUser = async (email: string) => {
  const adminApp = firebaseAdminInit();
  const auth = adminApp.auth();
  const uid = (await auth.getUserByEmail(email)).uid;
  await auth.deleteUser(uid);
};

export const verifyIdToken = async (idToken: string) => {
  const adminApp = firebaseAdminInit();
  const auth = adminApp.auth();
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (e) {
    console.log(e);
    return false;
  }
};
