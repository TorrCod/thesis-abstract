import { ThesisItems } from "@/context/types.d";
import {
  addData,
  addDataWithExpiration,
  deleteData,
  generateId,
  getData,
} from "@/lib/mongo";
import { validateAuth } from "@/utils/server-utils";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.query.container !== "thesis-items") {
      const isValidated = await validateAuth(req);
      if (isValidated.error) {
        return res.status(400).json(isValidated);
      }
    }
    switch (req.method) {
      case "GET": {
        type ActionKey = "deleted-thesis" | "thesis-items";
        const action = {
          "deleted-thesis": async () => {
            const deletedThesis = await getData(
              "thesis-abstract",
              "deleted-thesis"
            );
            return deletedThesis;
          },
          "thesis-items": async () => {
            const thesisItems = await getData(
              "thesis-abstract",
              "thesis-items"
            );
            return thesisItems;
          },
        };
        const query = req.query.container as ActionKey;
        const payload = await action[query]();
        return res.status(200).json(payload);
      }
      case "DELETE": {
        const id = req.body;
        switch (req.query.method) {
          case "RESTORE": {
            const thesisItems = (
              await getData(
                "thesis-abstract",
                "deleted-thesis",
                { _id: new ObjectId(id) },
                { deleteAfterGet: true }
              )
            )[0];
            delete thesisItems.createdAt;
            delete thesisItems.expireAfterSeconds;
            const resData = await addData(
              "thesis-abstract",
              "thesis-items",
              thesisItems
            );
            return res.status(200).json(resData);
          }
          default: {
            const thesisItems = (
              await getData(
                "thesis-abstract",
                "thesis-items",
                { _id: new ObjectId(id) },
                { deleteAfterGet: true }
              )
            )[0];
            const resData = await addDataWithExpiration(
              "thesis-abstract",
              "deleted-thesis",
              thesisItems,
              604800
            );
            return res.status(200).json(resData);
          }
        }
      }
      case "POST": {
        const thesisItem: ThesisItems = req.body;
        const resData = await addData(
          "thesis-abstract",
          "thesis-items",
          thesisItem
        );
        return res.status(200).json(resData);
      }
      default:
        return res.status(400).json({ error: "no method" });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server error" });
  }
};

export default handler;
