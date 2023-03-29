import axios from "axios";
import { io } from "socket.io-client";
import { userConfig } from "./account-utils";

export const readSocket = (
  token: string | undefined,
  name: string,
  callback: (changeStream: any) => Promise<void> | ((changeStream: any) => void)
) => {
  if (!token) {
    throw new Error("Cannot read user token");
  }
  const socket = io();
  const unsubscribe = () => {
    socket.off(name);
    socket.close();
  };
  axios.get("/api/socket", userConfig(token)).then(() => {
    socket.on(name, async (changeStream) => {
      callback(changeStream);
    });
  });
  return unsubscribe;
};
