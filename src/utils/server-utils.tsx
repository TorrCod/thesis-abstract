import { UserDetails } from "@/context/types.d";
import { verifyIdToken } from "@/lib/firebase-admin";
import { addData, getData } from "@/lib/mongo";
import { ActivitylogReason } from "@/lib/types";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getCsrfToken } from "next-auth/react";

export const validateAuth = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{
  error?: string;
  validated?: boolean;
  decodedToken?: DecodedIdToken | false;
}> => {
  const csrfToken = await getCsrfToken({ req });
  const session = await getServerSession(req, res, authOptions);
  if (!csrfToken && !session) {
    return { error: "UNAUTHORIZE ACCESS" };
  }
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
  const insertedResult = await addData("accounts", "activity-log", {
    userId: userUid,
    reason: reason,
    data: { itemId: Itemid, name: name },
    date: date,
  });
  return insertedResult;
};

export const parseQuery = (req: NextApiRequest) => {
  const { year, course, title } = req.query as {
    year: string | undefined;
    course: string | undefined;
    title: string | undefined;
  };
  let option:
    | {
        projection: Record<string, 0 | 1> | undefined;
        limit: number | undefined;
      }
    | undefined;

  if (req.query.option) {
    option = JSON.parse(req.query.option as string);
  }
  const rawQuery = { year, course, title };
  const res = Object.fromEntries(
    Object.entries(rawQuery).filter(
      ([_, value]) => value !== undefined && value !== ""
    )
  );
  if (res.course) (res.course as any) = { $in: JSON.parse(res.course) };
  if (res.year) {
    (res.year as any) = (JSON.parse(res.year) as string[]).map((item) =>
      parseInt(item)
    );
    (res.year as any) = { $in: res.year };
  }
  if (res.title)
    (res.title as any) = { $regex: new RegExp(`${res.title}`, "i") };
  return {
    query: res,
    option,
  };
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
