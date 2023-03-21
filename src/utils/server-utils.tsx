import { verifyIdToken } from "@/lib/firebase-admin";
import { isAuthenticated } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

export const validateAuth = async (
  req: NextApiRequest
): Promise<{ error?: string; validated?: boolean }> => {
  if (!req.headers.authorization) return { error: "Insufficient Input" };
  const token = req.headers.authorization?.slice(7);
  const checkAuth = await verifyIdToken(token);
  if (!checkAuth) return { error: "invalid user" };
  return { validated: true };
};
