import { UserDetails } from "@/context/types.d";
import { getData } from "@/lib/mongo";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const headers = req.headers;
    const isUserExist = await getData("accounts", "user", { uid: headers.uid });
    if (!isUserExist.length) throw new Error("You are not logged in");
    const users: UserDetails[] = (await getData("accounts", "user")) as any;
    const pendingUsers = await getData("accounts", "pending");
    return res.status(200).json({ users: users, pendingUsers: pendingUsers });
  } catch (e) {
    console.error((e as Error).message);
    return res.status(500).json({ err: (e as Error).message });
  }
};

export default handler;
