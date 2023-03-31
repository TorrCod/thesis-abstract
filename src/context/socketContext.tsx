import { auth } from "@/lib/firebase";
import { readSocket } from "@/utils/socket-utils";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import useGlobalContext from "./globalContext";
import { SocketOnEvent, SocketValue } from "./types.d";
import userContext from "./userContext";

const socketValueInit: SocketValue = {
  triggerSocket(event, payload) {},
};

const SocketContext = createContext<SocketValue>(socketValueInit);

export const SocketWrapper = ({ children }: { children: ReactNode }) => {
  const { state, loadAllUsers } = userContext();
  const userDetails = state.userDetails;
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();

  const {
    state: globalState,
    removeThesisItem,
    addThesisItem,
    restoreThesis,
    recycleThesis,
  } = useGlobalContext();

  useEffect(() => {
    const subscribe = async () => {
      const token = await auth.currentUser?.getIdToken();
      await readSocket(token);
      socket.current = io();
    };
    if (userDetails && auth.currentUser) subscribe();
    else {
      socket.current?.removeAllListeners();
      socket.current?.close();
    }
  }, [userDetails]);

  useEffect(() => {
    if (socket.current) {
      if (!socket.current.connected) socket.current.connect();

      socket.current.on("change/account-update", (changeStream) => {
        console.log("account update");
      });

      socket.current.on("change/thesis-update", (changeStream) => {
        console.log("thesis-items update");
      });

      socket.current.on("change/activitylog-update", (changeStream) => {
        console.log("activity log update");
      });
    }
    return () => {
      if (socket.current?.connected) {
        socket.current.removeAllListeners();
      }
    };
  }, [
    globalState.thesisItems,
    globalState.recyclebin,
    socket.current?.connected,
    state.activityLog,
    globalState.loading.includes("all-thesis"),
    globalState.loading.includes("all-admin"),
  ]);

  const triggerSocket = (event: SocketOnEvent, payload: any) => {
    if (socket.current) socket.current.emit(event, payload ?? "update");
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
