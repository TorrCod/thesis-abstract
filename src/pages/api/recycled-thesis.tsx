import { ThesisItems } from "@/context/types.d";
import { generateId, getData, isAuthenticated } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.headers.authorization)
      res.status(400).json({ message: "Insufficient Input" });
    const uid = req.headers.authorization;
    console.log(req.headers.authorization);
    if (!(await isAuthenticated(uid!)))
      res.status(400).json({ message: "User not found" });

    const items = (await getData("thesis-abstract", "deleted-thesis")) as any[];
    const itemsList: ThesisItems[] = generateId(items);
    return res.status(200).json(itemsList);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "server error" });
  }
};

export default handler;
