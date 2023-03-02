import { connectToDatabase } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await connectToDatabase();
    const db = client.db("accounts");
    const requestItems = req.body;

    const items = await db.collection("user").insertOne(requestItems);

    return res.json(items);
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};

export default handler;
