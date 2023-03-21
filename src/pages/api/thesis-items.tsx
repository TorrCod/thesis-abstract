import { ThesisItems } from "@/context/types.d";
import {
  addData,
  addDataWithExpiration,
  deleteData,
  generateId,
  getData,
} from "@/lib/mongo";
import { validateAuth } from "@/utils/server-utils";
import { AxiosRequestConfig } from "axios";
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
