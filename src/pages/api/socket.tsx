import { watchUser } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { Server, Socket } from "socket.io";

const SocketHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if ((res.socket as any).server.io) {
    console.log("Already Connected");
  } else {
    console.log("Initializing");
    const io = new Server((res.socket as any).server);
    (res.socket as any).server.io = io;

    watchUser((onChange) => {
      console.log("watching user changed");
      console.log(onChange);
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
