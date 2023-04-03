import { watchChanges } from "@/lib/mongo";
import {
  ClientToServerEvents,
  NextApiResponseWithSocket,
  ServerToClientEvents,
} from "@/lib/types";
import { validateAuth } from "@/utils/server-utils";
import { NextApiRequest } from "next";
import { Server } from "socket.io";

const SocketHandler = async (
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) => {
  const isValidated = await validateAuth(req, res);
  if (isValidated.error) {
    return res.status(400).send("UNAUTHORIZE ACCESS");
  }
  if (res.socket.server.io) {
  } else {
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(
      res.socket.server
    );
    res.socket.server.io = io;
    io.on("connection", async (socket) => {
      console.log(socket.id, "Connected");
      watchChanges().then((client) => {
        socket.on("account-update", () => {
          socket.broadcast.emit("change/account-update");
          io.emit("change/activitylog-update");
          socket.emit("acknowledged");
        });

        socket.on("thesis-update", () => {
          socket.broadcast.emit("change/thesis-update");
          io.emit("change/activitylog-update");
          socket.emit("acknowledged");
        });

        socket.on("disconnect", () => {
          console.log(socket.id, "Disconnected");
          client.unsubscribe();
        });
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
