import { UserDetails } from "@/context/types.d";
import { addData, updateUser } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const payload: UserDetails = req.body;
    const items = await updateUser(payload);
    return res.json(items);
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};

export default handler;
