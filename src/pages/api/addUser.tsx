import { addData } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userData = req.body;
    const items = await addData("accounts", "user", userData);
    return res.json(items);
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};

export default handler;
