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
  calculateThesisCount,
  parseQuery,
  updateActivityLog,
  validateAuth,
} from "@/utils/server-utils";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const isValidated = await validateAuth(req, res);
    if (isValidated.error) {
      return res.status(400).json(isValidated);
    }
    switch (req.method) {
      case "GET": {
        const { query, option } = parseQuery(req);

        const pageSize = (req.query.pageSize &&
          parseInt(req.query.pageSize as string)) as number;
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
            thesisItems.dateAdded = new Date(thesisItems.dateAdded);
            const response = await addData(
              "thesis-abstract",
              "thesis-items",
              thesisItems
            );
            const activityLog = await updateActivityLog(
              isValidated.decodedToken as DecodedIdToken,
              "restored a thesis",
              response.insertedId,
              new Date(),
              thesisItems.title
            );

            const thesisCount = await calculateThesisCount();
            const pusher = new Pusher(JSON.parse(process.env.PUSHER || "{}"));
            pusher.trigger("thesis-update", "remove-thesis", {
              addedData: thesisItems,
              activityLog,
              thesisCharts: {
                thesisCount,
                totalCount: thesisCount.reduce(
                  (acc, { count }) => acc + count,
                  0
                ),
              },
            });

            return res.status(200).json({
              addedData: thesisItems,
              activityLog,
              thesisCharts: {
                thesisCount,
                totalCount: thesisCount.reduce(
                  (acc, { count }) => acc + count,
                  0
                ),
              },
            });
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
            if (!thesisItems) {
              return res.status(400).send("not found");
            }
            const addedData = await addDataWithExpiration(
              "thesis-abstract",
              "deleted-thesis",
              thesisItems,
              604800
            );
            const activityLog = await updateActivityLog(
              isValidated.decodedToken as DecodedIdToken,
              "removed a thesis",
              addedData._id,
              addedData.createdAt,
              thesisItems.title
            );

            const pusher = new Pusher(JSON.parse(process.env.PUSHER || "{}"));
            const thesisCount = await calculateThesisCount();

            pusher.trigger("thesis-update", "remove-thesis", {
              addedData,
              activityLog,
              thesisCharts: {
                thesisCount,
                totalCount: thesisCount.reduce(
                  (acc, { count }) => acc + count,
                  0
                ),
              },
            });

            return res.status(200).json({
              addedData,
              activityLog,
              thesisCharts: {
                thesisCount,
                totalCount: thesisCount.reduce(
                  (acc, { count }) => acc + count,
                  0
                ),
              },
            });
          }
        }
      }
      case "POST": {
        const thesisItem = req.body;
        const new_id = new ObjectId(req.body._id);
        (thesisItem._id as any) = new_id;
        thesisItem.id = new_id.toString();
        if (typeof thesisItem.dateAdded === "string") {
          thesisItem.dateAdded = new Date(thesisItem.dateAdded);
        }
        const resData = await addData(
          "thesis-abstract",
          "thesis-items",
          thesisItem
        );
        const activityLog = await updateActivityLog(
          isValidated.decodedToken as DecodedIdToken,
          "added a thesis",
          resData.insertedId,
          thesisItem.dateAdded,
          thesisItem.title
        );

        const pusher = new Pusher(JSON.parse(process.env.PUSHER || "{}"));
        const thesisCount = await calculateThesisCount();

        pusher.trigger("thesis-update", "add-thesis", {
          addedData: thesisItem,
          activityLog,
          thesisCharts: {
            thesisCount,
            totalCount: thesisCount.reduce((acc, { count }) => acc + count, 0),
          },
        });

        return res.status(200).json({
          addedData: thesisItem,
          activityLog,
          thesisCharts: {
            thesisCount,
            totalCount: thesisCount.reduce((acc, { count }) => acc + count, 0),
          },
        });
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
