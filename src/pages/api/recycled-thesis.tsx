import { ThesisItems } from "@/context/types.d";
import {
  addData,
  addDataWithExpiration,
  deleteData,
  generateId,
  getData,
  isAuthenticated,
} from "@/lib/mongo";
import { validateAuth } from "@/utils/server-utils";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const isValidated = await validateAuth(req);
    if (isValidated.error) {
      return res.status(400).json(isValidated);
    }

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
        const data = (
          await getData(
            "thesis-abstract",
            "deleted-thesis",
            {
              _id: new ObjectId(req.body._id),
            },
            { deleteAfterGet: true }
          )
        )[0];
        await addData("thesis-abstract", "thesis-items", data);
        return res.status(200).json({ restoredItems: data });
      }
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server error" });
  }
};

export default handler;
