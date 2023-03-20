import { addData } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userData = req.body;
    await addData("accounts", "user", userData);
    return res.json(userData);
  } catch (e) {
    console.error(e);
  }
};

export default handler;
