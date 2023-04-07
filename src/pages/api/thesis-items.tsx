import { ThesisItems } from "@/context/types.d";
import {
  addData,
  addDataWithExpiration,
  getData,
  getDataWithPaging,
} from "@/lib/mongo";
import { CollectionName } from "@/lib/types";
import { sleep } from "@/utils/helper";
import {
  parseQuery,
  updateActivityLog,
  validateAuth,
} from "@/utils/server-utils";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await sleep(2000);
  try {
    const isValidated = await validateAuth(req, res);
    if (isValidated.error) {
      return res.status(400).json(isValidated);
    }
    switch (req.method) {
      case "GET": {
        const { query, option } = parseQuery(req);
        const pageSize = option?.limit;
        const pageNo = (req.query.pageNo &&
          parseInt(req.query.pageNo as string)) as number;
        const payload = await getDataWithPaging(
          "thesis-abstract",
          req.query.collection as CollectionName,
          { pageNo: pageNo, pageSize },
          query,
          {
            limit: option?.limit,
            projection: option?.projection,
          }
        );
        return res.status(200).json(payload);
      }
      case "DELETE": {
        const thesisId = req.query._id as string | undefined;
        if (!thesisId) {
          return res.status(400).json({ error: "undefined id" });
        }
        switch (req.query.method) {
          case "RESTORE": {
            const thesisItems = (
              await getData(
                "thesis-abstract",
                "deleted-thesis",
                { _id: new ObjectId(thesisId) },
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
            await updateActivityLog(
              isValidated.decodedToken as DecodedIdToken,
              "restored a thesis",
              resData.insertedId,
              new Date(),
              thesisItems.title
            );
            return res.status(200).json(resData);
          }
          default: {
            const thesisItems = (
              await getData(
                "thesis-abstract",
                "thesis-items",
                { _id: new ObjectId(thesisId) },
                { deleteAfterGet: true }
              )
            )[0];
            const resData = await addDataWithExpiration(
              "thesis-abstract",
              "deleted-thesis",
              thesisItems,
              604800
            );
            await updateActivityLog(
              isValidated.decodedToken as DecodedIdToken,
              "removed a thesis",
              resData.insertedResult.insertedId,
              resData.dateNow,
              thesisItems.title
            );
            return res.status(200).json(resData);
          }
        }
      }
      case "POST": {
        const thesisItem: ThesisItems = req.body;
        const new_id = new ObjectId();
        (thesisItem._id as any) = new_id;
        thesisItem.id = new_id.toString();
        const resData = await addData(
          "thesis-abstract",
          "thesis-items",
          thesisItem
        );
        await updateActivityLog(
          isValidated.decodedToken as DecodedIdToken,
          "added a thesis",
          resData.insertedId,
          thesisItem.dateAdded,
          thesisItem.title
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
