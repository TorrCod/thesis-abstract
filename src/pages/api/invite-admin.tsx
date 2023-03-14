import { addDataWithExpiration } from "@/lib/mongo";
import { AddPost } from "@/lib/types";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { dbName, colName, payload }: AddPost = req.body;
    const response = await addDataWithExpiration(dbName, colName, payload);
    return res.status(200).json({ message: "sucess", response });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "add failed" });
  }
};

export default handler;
