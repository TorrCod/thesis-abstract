import { watchChanges } from "@/lib/mongo";
import { NextApiResponseWithSocket } from "@/lib/types";
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
    const io = new Server((res.socket as any).server);
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      console.log("New Client Connected: ", socket.id);

      watchChanges("accounts", "activity-log", (changeStream) => {
        console.log("activity log updated");
      });

      watchChanges("accounts", "user", (changeStream) => {
        console.log("user updated");
      });

      watchChanges("accounts", "pending", (changeStream) => {
        console.log("pending updated");
      });

      watchChanges("thesis-abstract", "thesis-items", (changeStream) => {
        console.log("Thesis Items Updated");
      });

      watchChanges("thesis-abstract", "deleted-thesis", (changeStream) => {
        console.log("deleted thesis updated");
      });

      socket.on("disconnect", () => {
        console.log(socket.id, "Disconnected");
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
