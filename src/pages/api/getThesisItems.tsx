import { ThesisItems } from "@/context/types.d";
import { generateId, getData } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ThesisItems[]>
) => {
  try {
    const items = (await getData("thesis-abstract", "thesis-items")) as any[];
    const itemsList: ThesisItems[] = generateId(items);
    return res.json(itemsList);
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};

export default handler;
