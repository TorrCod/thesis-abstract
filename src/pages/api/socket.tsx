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
      console.log(socket.id, "Connected");

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

        // client.subscribe("accounts", "user", (changestream) => {
        //   io.emit("change/account-update", changestream);
        // });

        // client.subscribe("accounts", "pending", (changestream) => {
        //   io.emit("change/account-update", changestream);
        // });

        // client.subscribe("accounts", "activity-log", (changestream) => {
        //   io.emit("change/activity-log", changestream);
        // });

        // client.subscribe("thesis-abstract", "thesis-items", (changeStream) => {
        //   io.emit("change/thesis-items", changeStream);
        // });

        // client.subscribe(
        //   "thesis-abstract",
        //   "deleted-thesis",
        //   (changeStream) => {
        //     io.emit("change/thesis-items", changeStream);
        //   }
        // );

        socket.on("account-update", (payload) => {
          socket.broadcast.emit("change/account-update", payload);
        });

        socket.on("thesis-update", (payload) => {
          socket.broadcast.emit("change/thesis-update", payload);
        });

        socket.on("activitylog-update", (payload) => {
          socket.broadcast.emit("change/activitylog-update", payload);
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
