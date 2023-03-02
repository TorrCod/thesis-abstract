import { ThesisItems } from "@/context/types.d";
import { getData } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ThesisItems[]>
) => {
  try {
    const items = (await getData("thesis-abstract", "thesis-items")) as any[];
    const itemsList: ThesisItems[] = items.map((child) => ({
      ...child,
      _id: child._id.toString(),
      id: child._id.toString(),
    }));
    return res.json(itemsList);
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};

export default handler;
