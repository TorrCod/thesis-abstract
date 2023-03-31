import userContext from "@/context/userContext";
import { readSocket } from "@/utils/socket-utils";
import { auth } from "@/lib/firebase";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import useGlobalContext from "@/context/globalContext";
import useUserContext from "@/context/userContext";

const WatchChanges = ({ children }: { children: React.ReactNode }) => {
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
      console.log(socket.current.connected);

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

      console.log(socket.current.listeners("change/account-update"));
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

  return <>{children}</>;
};

export default WatchChanges;
