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
    const isValidated = await validateAuth(req);
    if (isValidated.error) {
      return res.status(400).json(isValidated);
    }

    switch (req.method) {
      case "GET": {
      }
      case "DELETE": {
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
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server error" });
  }
};

export default handler;
