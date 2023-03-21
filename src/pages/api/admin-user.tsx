import { ThesisItems } from "@/context/types.d";
import {
  addData,
  addDataWithExpiration,
  deleteData,
  generateId,
  getData,
} from "@/lib/mongo";
import { CollectionName } from "@/lib/types";
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
        const collection = req.query.collection as CollectionName;
        const uid = req.query.uid as string | undefined;
        const query = uid ? { uid: uid } : undefined;
        const userDetails = await getData("accounts", collection, query);
        return res.status(200).json(userDetails);
      }
      case "DELETE": {
        const collection = req.query.collection as CollectionName;
        const _id = req.query._id as string | undefined;
        const deleteRes = await deleteData("accounts", collection, {
          _id: new ObjectId(_id),
        });
        return res.status(200).json(deleteRes);
      }
      case "POST": {
        switch (req.query.objective) {
          case "invite-user": {
            const collection = req.query.collection as CollectionName;
            const inserResult = await addDataWithExpiration(
              "accounts",
              collection,
              req.body,
              604800
            );
            return res.status(200).json(inserResult);
          }
          default:
            return res.status(400).send("syntax error");
        }
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
