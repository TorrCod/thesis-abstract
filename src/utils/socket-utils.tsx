import axios from "axios";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { userConfig } from "./account-utils";

export const readSocket = async (token: string | undefined) => {
  if (!token) {
    throw new Error("Cannot read user token");
  }
  await axios.get("/api/socket", userConfig(token));
};
