import { isAuthenticated } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

export const validateAuth = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ error?: string; validated?: boolean }> => {
  if (!req.headers.authorization) return { error: "Insufficient Input" };
  const uid = req.headers.authorization?.slice(7);
  const checkAuth = (await isAuthenticated(uid!))[0];
  if (!checkAuth) return { error: "invalid user" };
  return { validated: true };
};
