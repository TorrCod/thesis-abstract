import { ThesisItems } from "@/context/types.d";
import { connectToDatabase } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ThesisItems[]>
) => {
  try {
    const client = await connectToDatabase();
    const db = client.db("thesis-abstract");
    const items: ThesisItems[] = (await db
      .collection("thesis-items")
      .find()
      .toArray()) as unknown as ThesisItems[];
    return res.json(items);
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};

export default handler;
