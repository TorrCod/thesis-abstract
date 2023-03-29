import { watchThesisAbstract, watchUser } from "@/lib/mongo";
import { validateAuth } from "@/utils/server-utils";
import { NextApiRequest, NextApiResponse } from "next";
import { Server, Socket } from "socket.io";

const SocketHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const isValidated = await validateAuth(req, res);
  if (isValidated.error) {
    return res.status(400).send("UNAUTHORIZE ACCESS");
  }
  if ((res.socket as any).server.io) {
  } else {
    console.log("Socket Registered");
    const io = new Server((res.socket as any).server);
    (res.socket as any).server.io = io;
    watchUser((onChange) => {
      io.emit("account-update", {
        message: "account changed",
        changeStream: onChange,
      });
    });
    watchThesisAbstract((onChange) => {
      io.emit("thesis-abstract-update", {
        message: "account changed",
        changeStream: onChange,
      });
    });

    io.on("disconnect", (reason) => {
      console.log(reason);
    });
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default SocketHandler;
