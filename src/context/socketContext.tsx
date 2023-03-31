import { auth } from "@/lib/firebase";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketEmitEvent,
} from "@/lib/types";
import { readSocket } from "@/utils/socket-utils";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import useGlobalContext from "./globalContext";
import { SocketValue } from "./types.d";
import userContext from "./userContext";

const socketValueInit: SocketValue = {
  triggerSocket(event) {},
};

const SocketContext = createContext<SocketValue>(socketValueInit);

export const SocketWrapper = ({ children }: { children: ReactNode }) => {
  const { state, loadAllUsers, loadActivityLog } = userContext();
  const userDetails = state.userDetails;
  const socketRef =
    useRef<Socket<ServerToClientEvents, ClientToServerEvents>>();

  const {
    state: globalState,
    loadThesisItems,
    loadThesisCount,
    loadRecycle,
  } = useGlobalContext();

  useEffect(() => {
    const subscribe = async () => {
      const token = await auth.currentUser?.getIdToken();
      await readSocket(token);
      const socket = io();
      socket.on("connect", () => {
        socketRef.current = socket;
      });
    };
    if (userDetails && auth.currentUser) subscribe();
    else {
      socketRef.current?.removeAllListeners();
      socketRef.current?.close();
    }
  }, [userDetails]);

  useEffect(() => {
    if (socketRef.current) {
      if (!socketRef.current.connected) socketRef.current.connect();

      socketRef.current.on("change/account-update", () => {
        console.log("account update");
        loadAllUsers();
      });

      socketRef.current.on("change/thesis-update", async () => {
        console.log("thesis update");
        console.log(globalState.searchTitle);

        loadThesisItems();
        loadThesisCount();
        loadRecycle();
      });

      socketRef.current.on("change/activitylog-update", () => {
        console.log("activity log update");
        loadActivityLog();
      });
    }
    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.removeAllListeners();
      }
    };
  }, [
    globalState.thesisItems,
    globalState.recyclebin,
    socketRef.current?.connected,
    state.activityLog,
    globalState.loading.includes("all-thesis"),
    globalState.loading.includes("all-admin"),
    globalState.searchTitle,
  ]);

  const triggerSocket = (event: SocketEmitEvent) => {
    if (socketRef.current) socketRef.current.emit(event);
  };

  return (
    <SocketContext.Provider
      value={{
        triggerSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const useSocketContext = () => useContext(SocketContext);

export default useSocketContext;
