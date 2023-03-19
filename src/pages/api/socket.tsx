import { watchThesisAbstract, watchUser } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { Server, Socket } from "socket.io";

const SocketHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if ((res.socket as any).server.io) {
  } else {
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
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default SocketHandler;
