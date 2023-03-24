import { UserDetails } from "@/context/types.d";
import { verifyIdToken } from "@/lib/firebase-admin";
import { addData, getData } from "@/lib/mongo";
import { ActivitylogReason } from "@/lib/types";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ObjectId } from "mongodb";
import { NextApiRequest } from "next";

export const validateAuth = async (
  req: NextApiRequest
): Promise<{
  error?: string;
  validated?: boolean;
  decodedToken?: DecodedIdToken | false;
}> => {
  if (!req.headers.authorization) return { error: "Insufficient Input" };
  const token = req.headers.authorization?.slice(7);
  const checkAuth = await verifyIdToken(token);
  if (!checkAuth) return { error: "invalid user" };
  return { validated: true, decodedToken: checkAuth };
};

export const updateActivityLog = async (
  decodedToken: DecodedIdToken,
  reason: ActivitylogReason,
  Itemid: ObjectId,
  date: Date,
  name: string
) => {
  const userUid = decodedToken.uid;
  const userDetailsList = (await getData("accounts", "user", {
    uid: userUid,
  })) as UserDetails[];
  const userName = userDetailsList[0].userName;
  const insertedResult = await addData("accounts", "activity-log", {
    userName: userName,
    reason: reason,
    data: { itemId: Itemid, name: name },
    date: date,
  });
  return insertedResult;
};

export const parseQuery = (object: Object) => {
  const res = Object.fromEntries(
    Object.entries(object).filter(([_, value]) => value !== undefined)
  );
  if (res.course) res.course = { $in: JSON.parse(res.course) };
  return res;
};
