import { ThesisItems } from "@/context/types.d";
import { generateId, getData } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const items = (await getData("thesis-abstract", "thesis-items")) as any[];
    const itemsList: ThesisItems[] = generateId(items);
    return res.status(200).json(itemsList);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "server error" });
  }
};

export default handler;
