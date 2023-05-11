import { generateCustomToken, setCustomClaims } from "@/lib/firebase-admin";
import { validateAuth, verifyUserToken } from "@/utils/server-utils";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const decodedToken = await verifyUserToken(req);
    await setCustomClaims(decodedToken.uid);
    const customToken = await generateCustomToken(decodedToken.uid);
    return res.status(200).json({ customToken });
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
};

export default handler;
