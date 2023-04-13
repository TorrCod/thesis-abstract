import { ThesisCount, UserDetails } from "@/context/types.d";
import { verifyIdToken } from "@/lib/firebase-admin";
import { addData, dataAgregate, getData } from "@/lib/mongo";
import { ActivitylogReason, CollectionName, DatabaseName } from "@/lib/types";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getCsrfToken } from "next-auth/react";
import { serialize } from "cookie";
import Pusher from "pusher";

export const validateAuth = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{
  error?: string;
  validated?: boolean;
  decodedToken?: DecodedIdToken | false;
}> => {
  try {
    const csrfToken = await getCsrfToken({ req });
    const session = await getServerSession(req, res, authOptions);
    if (!csrfToken && !session) {
      throw new Error("UNAUTHORIZE ACCESS");
    }
    if (!req.headers.authorization) throw new Error("Insufficient Input");
    const token = req.headers.authorization?.slice(7);
    const checkAuth = await verifyIdToken(token);
    if (!checkAuth) throw new Error("Invalid User");
    return { validated: true, decodedToken: checkAuth };
  } catch (e) {
    clearNextAuthCookie(res);
    res.setHeader("Location", req.headers.referer || "/");
    return { error: (e as Error).message };
  }
};

export const clearNextAuthCookie = (res: NextApiResponse) => {
  res.setHeader("Set-Cookie", [
    serialize("next-auth.csrf-token", "", { maxAge: -1, path: "/" }),
    serialize("next-auth.callback-url", "", { maxAge: -1, path: "/" }),
    serialize("next-auth.session-token", "", { maxAge: -1, path: "/" }),
  ]);
};

export const updateActivityLog = async (
  decodedToken: DecodedIdToken,
  reason: ActivitylogReason,
  Itemid: ObjectId,
  date: Date,
  name: string
) => {
  const userUid = decodedToken.uid;
  const _id = new ObjectId();
  await addData("accounts", "activity-log", {
    _id,
    userId: userUid,
    reason: reason,
    data: { itemId: Itemid, name: name },
    date: date,
  });
  return {
    _id,
    userId: userUid,
    reason: reason,
    data: { itemId: Itemid, name: name },
    date: date,
  };
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
    query: res as unknown as {
      title?: Record<string, any>;
      year?: Record<string, any>;
      course: Record<string, any>;
    },
    option,
  };
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const calculateThesisCount = async () => {
  const response = await dataAgregate("thesis-abstract", "thesis-items", [
    { $group: { _id: "$course", count: { $sum: 1 } } },
  ]);
  const thesisCount: ThesisCount = response.map((item) => ({
    course: item._id,
    count: item.count,
  }));

  return thesisCount;
};

export const pusherInit = () => {
  let secretKey: string = process.env.PUSER ?? "";
  if (process.env.NODE_ENV === "development") {
    console.log("pusher devs");
    secretKey =
      '{"appId": "1583848","key": "866c012957a8a998c831","secret": "91b4cac0e12d5bf9cc07","cluster": "ap1","useTLS": true}';
  }
  const pusher = new Pusher(JSON.parse(secretKey));
  return pusher;
};
