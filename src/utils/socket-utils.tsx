import axios from "axios";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { userConfig } from "./account-utils";

export const readSocket = (
  token: string | undefined,
  name: string,
  callback: (changeStream: any) => Promise<void> | void
) => {
  if (!token) {
    throw new Error("Cannot read user token");
  }
  let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
  const unsubscribe = () => {
    if (socket && socket.connected) {
      console.log("unsubscribe");
      socket.off(name);
      socket.close();
    }
  };
  axios.get("/api/socket", userConfig(token)).then(() => {
    console.log("subscribe");
    socket = io();
    socket.on(name, async (changeStream) => {
      callback(changeStream);
    });
  });
  return { socket, unsubscribe };
};
