import { ThesisItems } from "@/context/types.d";
import {
  addData,
  addDataWithExpiration,
  deleteData,
  generateId,
  getData,
  isAuthenticated,
} from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.headers.authorization)
      return res.status(400).json({ error: "Insufficient Input" });
    const uid = req.headers.authorization?.slice(7);
    const checkAuth = (await isAuthenticated(uid!))[0];
    if (!checkAuth) return res.status(400).json({ error: "auth failed" });

    switch (req.method) {
      case "GET": {
        const items = (await getData(
          "thesis-abstract",
          "deleted-thesis"
        )) as any[];
        const itemsList: ThesisItems[] = generateId(items);
        return res.status(200).json(itemsList);
      }
      case "POST": {
        const recycleStatus = await addDataWithExpiration(
          "thesis-abstract",
          "deleted-thesis",
          { ...req.body, _id: new ObjectId(req.body._id) },
          86400
        );
        const deleteStatus = await deleteData({
          data: "",
          query: { _id: req.body.id },
          mongoDetails: {
            databaseName: "thesis-abstract",
            collectionName: "thesis-items",
          },
        });
        return res
          .status(200)
          .json({ recyleStatus: recycleStatus, deleteStatus: deleteStatus });
      }
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server error" });
  }
};

export default handler;
