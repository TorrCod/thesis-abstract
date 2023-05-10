import * as admin from "firebase-admin";
import { SessionCookieOptions } from "firebase-admin/lib/auth/base-auth";
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
    console.error(e);
    return false;
  }
};

export const createSessionCookies = async (
  token: string,
  option: SessionCookieOptions
) => {
  const adminApp = firebaseAdminInit();
  const succcess = await adminApp.auth().createSessionCookie(token, option);
  return succcess;
};

export const verifySessionCookie = async (sessionCookies: string) => {
  const adminApp = firebaseAdminInit();
  const auth = adminApp.auth();
  const decodedClaims = await auth.verifySessionCookie(sessionCookies);
  return decodedClaims;
};

export const getCustomClaims = async (uid: string) => {
  const adminApp = firebaseAdminInit();
  const customClaims = (await adminApp.auth().getUser(uid)).customClaims;
  return customClaims;
};

export const adminUploadFile = async (
  filePath: string,
  destination: string,
  contentType?: string
) => {
  const admin = firebaseAdminInit();
  const bucket = admin.storage().bucket();
  const response = await bucket.upload(filePath, {
    destination,
    preconditionOpts: { ifGenerationMatch: 0 },
    contentType: contentType ?? "image/jpeg",
    public: true,
  });
  return response;
};

export const downloadFile = async () => {
  const admin = firebaseAdminInit();
  const bucket = admin.storage().bucket();
  // const response = bucket.file('').baseUrl
  return { bucket: bucket.baseUrl };
};
