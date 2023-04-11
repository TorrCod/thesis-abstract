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

    switch (req.query.channel) {
      case "thesis-update":
        const action = req.query.action as string | undefined;
        const data = req.body;
        if (!data || !action)
          throw new Error("Insufficient Input", {
            cause: "INSUFFICIENT INPUT",
          });
        pusher.trigger("user_state", action, data);
        res.status(200).send("online");
        return res.end();
    }

    throw new Error("Insufficient Input", { cause: "INSUFFICIENT INPUT" });
  } catch (e) {
    if ((e as Error).cause === "INSUFFICIENT INPUT")
      return res.status(400).send("INSUFFICIENT INPUT");
    console.error(e);
    return res.status(500).end();
  }
};

export default handler;
