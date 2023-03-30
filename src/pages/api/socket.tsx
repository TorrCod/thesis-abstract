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
      console.log("Client Connected: ", socket.id);

      watchChanges().then((client) => {
        // client.subscribe("accounts", "activity-log", (changeStream) => {
        //   console.log("activity log updated");
        //   switch (changeStream.operationType) {
        //     case "insert": {
        //       io.emit("add-activity-log", changeStream.fullDocument);
        //       break;
        //     }
        //     case "delete": {
        //       io.emit(
        //         "remove-activity-log",
        //         changeStream.documentKey._id.toString()
        //       );
        //       break;
        //     }
        //   }
        // });

        // client.subscribe("accounts", "user", (changeStream) => {
        //   console.log("user updated");
        //   switch (changeStream.operationType) {
        //     case "insert": {
        //       io.emit("add-user", changeStream.fullDocument);
        //       break;
        //     }
        //     case "delete": {
        //       io.emit("remove-user", changeStream.documentKey._id.toString());
        //       break;
        //     }
        //     case "update": {
        //       io.emit("update-user", changeStream.fullDocument);
        //       break;
        //     }
        //   }
        // });

        // client.subscribe("accounts", "pending", (changeStream) => {
        //   console.log("pending updated");
        //   switch (changeStream.operationType) {
        //     case "insert": {
        //       io.emit("add-pending", changeStream.fullDocument);
        //       break;
        //     }
        //     case "delete": {
        //       io.emit(
        //         "remove-pending",
        //         changeStream.documentKey._id.toString()
        //       );
        //       break;
        //     }
        //   }
        // });

        // client.subscribe("thesis-abstract", "thesis-items", (changeStream) => {
        //   console.log("Thesis Items Updated");
        //   switch (changeStream.operationType) {
        //     case "insert": {
        //       io.emit("add-thesis", changeStream.fullDocument);
        //       break;
        //     }
        //     case "delete": {
        //       io.emit("remove-thesis", changeStream.documentKey._id.toString());
        //       break;
        //     }
        //   }
        // });

        // client.subscribe(
        //   "thesis-abstract",
        //   "deleted-thesis",
        //   (changeStream) => {
        //     console.log("deleted thesis updated");
        //     switch (changeStream.operationType) {
        //       case "insert": {
        //         io.emit("add-deleted-thesis", changeStream.fullDocument);
        //         break;
        //       }
        //       case "delete": {
        //         io.emit(
        //           "remove-deleted-thesis",
        //           changeStream.documentKey._id.toString()
        //         );
        //         break;
        //       }
        //     }
        //   }
        // );

        client.subscribe("accounts", "user", () => {
          io.emit("user-changes", "change detected");
        });

        client.subscribe("accounts", "pending", () => {
          io.emit("pending-changes", "change detected");
        });

        client.subscribe("accounts", "activity-log", () => {
          io.emit("activity-log-changes", "change detected");
        });

        client.subscribe("thesis-abstract", "thesis-items", (changeStream) => {
          socket.broadcast.emit("thesis-changes", changeStream);
        });

        client.subscribe("thesis-abstract", "deleted-thesis", () => {
          io.emit("deleted-thesis-changes", "change detected");
        });

        socket.on("disconnect", () => {
          console.log("Client Disconnected: ", socket.id);
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
