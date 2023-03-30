import { ActivityLog, ThesisItems } from "@/context/types.d";
import { createSessionCookies, verifyIdToken } from "@/lib/firebase-admin";
import {
  addData,
  addDataWithExpiration,
  deleteData,
  getData,
  getOneData,
  updateData,
} from "@/lib/mongo";
import { ActivitylogReason, CollectionName } from "@/lib/types";
import {
  parseQuery,
  updateActivityLog,
  validateAuth,
} from "@/utils/server-utils";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const isValidated = await validateAuth(req, res);
    if (isValidated.error) {
      return res.status(400).json(isValidated);
    }
    switch (req.method) {
      case "GET": {
        switch (req.query.objective) {
          case "get-activitylog": {
            const parse = parseQuery(req);
            const activityLog = await getData(
              "accounts",
              "activity-log",
              parse.query,
              { ...parse.option }
            );
            const withUserName_promise = activityLog.map(async (item) => {
              const response = await getOneData(
                "accounts",
                "user",
                { uid: item.userId },
                { projection: { userName: 1 } }
              );
              return { ...item, userName: response?.userName };
            });
            const withUsername = await Promise.all(withUserName_promise);
            return res.status(200).json(withUsername);
          }
          default: {
            const collection = req.query.collection as CollectionName;
            const uid = req.query.uid as string | undefined;
            const query = uid
              ? { uid: uid }
              : req.query._id
              ? { _id: new ObjectId(req.query._ud as string) }
              : undefined;
            const parse = parseQuery(req);
            const userDetails = await getData("accounts", collection, query, {
              ...parse.option,
            });
            return res.status(200).json(userDetails);
          }
        }
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
            const checkEmail = await getOneData("accounts", "user", {
              email: req.body.email,
            });
            if (checkEmail)
              return res
                .status(400)
                .send("email is exist please use another one");
            const { insertedResult, dateNow } = await addDataWithExpiration(
              "accounts",
              collection,
              req.body,
              604800
            );
            await updateActivityLog(
              isValidated.decodedToken as DecodedIdToken,
              "invited an admin",
              insertedResult.insertedId,
              dateNow,
              req.body.email
            );
            return res.status(200).json(insertedResult);
          }
          case "signup": {
            const collection = req.query.collection as CollectionName;
            req.body._id = new ObjectId(req.body._id);
            await getData(
              "accounts",
              "pending",
              { _id: req.body._id },
              { deleteAfterGet: true }
            );
            const insertResult = await addData(
              "accounts",
              collection,
              req.body
            );
            if (!insertResult.acknowledged)
              return res.status(204).json({ error: "Insert Data failed" });

            updateActivityLog(
              isValidated.decodedToken as DecodedIdToken,
              "accepted the invite",
              insertResult.insertedId,
              req.body.dateAdded,
              req.body.email
            );
            return res.status(200).json(req.body);
          }
          case "update-activity-log": {
            const reason = req.body.reason as ActivitylogReason;
            const itemId = req.body.itemId as string;
            const date = req.body.date as Date;
            const name = req.body.name as string;
            const insertedResult = await updateActivityLog(
              isValidated.decodedToken as DecodedIdToken,
              reason,
              new ObjectId(itemId),
              date,
              name
            );
            return res.status(200).json(insertedResult);
          }
          case "create-user-session": {
            const token = req.body.token;
            const csrfToken = req.body.csrfToken;
            if (token !== csrfToken)
              return res.status(401).send("ANAUTHORIZE REQUEST!");

            const decodedToken = (await verifyIdToken(token)) as DecodedIdToken;
            if (decodedToken.auth_time! < 5 * 60)
              return res.status(401).send("Recent sign in required");
            // Set session expiration to 5 days.
            const expiresIn = 60 * 60 * 24 * 5 * 1000;
            const session = await createSessionCookies(token, { expiresIn });
            return res
              .setHeader(
                "set-cookie",
                serialize("session", session, {
                  maxAge: expiresIn,
                  httpOnly: true,
                  path: "/",
                })
              )
              .status(200)
              .send("sucess");
          }
          default:
            return res.status(400).send("syntax error");
        }
      }
      case "PUT": {
        const collection = req.query.collection as CollectionName;
        const updateResult = await updateData(
          "accounts",
          collection,
          { _id: new ObjectId(req.query._id as string) },
          req.body
        );
        return res.status(200).json(updateResult);
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
