import { admin_deleteUser } from "@/lib/firebase-admin";
import { validateAuth } from "@/utils/server-utils";
import { FirebaseError } from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const isValidate = await validateAuth(req, res);
    if (isValidate.error) {
      return res.status(400).json(isValidate);
    }
    switch (req.method) {
      case "DELETE": {
        if (!req.body.email) return res.status(400).send("insufficient input");
        await admin_deleteUser(req.body.email);
        return res.status(200).json({ message: "account deleted" });
      }
    }
  } catch (e) {
    if ((e as FirebaseError).code === "auth/user-not-found") {
      return res.status(400).json({ error: (e as FirebaseError).message });
    }
    console.error(e);
    return res.status(500).send("API Error");
  }
};

export default handler;
