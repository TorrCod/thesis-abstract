import { validateAuth } from "@/utils/server-utils";
import { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

const pusher = new Pusher(JSON.parse(process.env.PUSHER || "{}"));

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const isValidated = await validateAuth(req, res);
    if (isValidated.error) {
      return res.status(400).json(isValidated);
    }

    switch (req.query.objective) {
      case "on-signin":
        if (!req.query.uid) return res.status(400).send("INSUFFICIENT INPUT");
        pusher.trigger("online", "on-signin", req.query.uid);
        res.status(200).send("online");
        return res.end();
      default:
        return res.status(400).send("INSUFFICIENT INPUT");
    }
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
};

export default handler;
