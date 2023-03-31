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
  } = useGlobalContext();

  useEffect(() => {
    const subscribe = async () => {
      const token = await auth.currentUser?.getIdToken();
      await readSocket(token);
      socket.current = io();
    };
    if (userDetails) subscribe();
    else {
      socket.current?.removeAllListeners();
      socket.current?.close();
    }
  }, [userDetails]);

  useEffect(() => {
    if (socket.current) {
      socket.current.connect();

      socket.current.on("account-update", (changeStream) => {
        loadAllUsers();
      });

      socket.current.on("thesis-changes", (changeStream) => {
        switch (changeStream.operationType) {
          case "delete": {
            removeThesisItem(changeStream.documentKey._id);
            break;
          }
        }
      });
    }
    return () => {
      if (socket.current?.connected) {
        socket.current.removeAllListeners();
      }
    };
  }, [globalState.thesisItems, globalState.recyclebin]);

  return <>{children}</>;
};

export default WatchChanges;
