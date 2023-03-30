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
    io.on("connection", async (socket) => {
      console.log("New Client Connected: ", socket.id);

      watchChanges().then((client) => {
        client.subscribe("accounts", "activity-log", (changeStream) => {
          console.log("activity log updated");
          switch (changeStream.operationType) {
            case "insert": {
              socket.broadcast.emit(
                "add-activity-log",
                changeStream.fullDocument
              );
              break;
            }
            case "delete": {
              socket.broadcast.emit("remove-activity-log", changeStream._id);
              break;
            }
          }
        });

        client.subscribe("accounts", "user", (changeStream) => {
          console.log("user updated");
          switch (changeStream.operationType) {
            case "insert": {
              socket.broadcast.emit("add-user", changeStream.fullDocument);
              break;
            }
            case "delete": {
              socket.broadcast.emit("remove-user", changeStream._id);
              break;
            }
            case "update": {
              socket.broadcast.emit("update-user", changeStream.fullDocument);
              break;
            }
          }
        });

        client.subscribe("accounts", "pending", (changeStream) => {
          console.log("pending updated");
          switch (changeStream.operationType) {
            case "insert": {
              socket.broadcast.emit("add-pending", changeStream.fullDocument);
              break;
            }
            case "delete": {
              socket.broadcast.emit("remove-pending", changeStream._id);
              break;
            }
          }
        });

        client.subscribe("thesis-abstract", "thesis-items", (changeStream) => {
          console.log("Thesis Items Updated");
          switch (changeStream.operationType) {
            case "insert": {
              socket.broadcast.emit("add-thesis", changeStream.fullDocument);
              break;
            }
            case "delete": {
              socket.broadcast.emit("remove-thesis", changeStream._id);
              break;
            }
          }
        });

        client.subscribe(
          "thesis-abstract",
          "deleted-thesis",
          (changeStream) => {
            console.log("deleted thesis updated");
            switch (changeStream.operationType) {
              case "insert": {
                socket.broadcast.emit(
                  "add-deleted-thesis",
                  changeStream.fullDocument
                );
                break;
              }
              case "delete": {
                socket.broadcast.emit(
                  "remove-deleted-thesis",
                  changeStream._id
                );
                break;
              }
            }
          }
        );

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
