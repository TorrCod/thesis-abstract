import userContext from "@/context/userContext";
import { readSocket } from "@/utils/socket-utils";
import { auth } from "@/lib/firebase";
import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import useGlobalContext from "@/context/globalContext";
import useUserContext from "@/context/userContext";

const WatchChanges = ({ children }: { children: React.ReactNode }) => {
  const { state, loadAllUsers } = userContext();
  const userDetails = state.userDetails;
  const thesisSocket = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const userSocketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const {
    state: globalState,
    removeThesisItem,
    addThesisItem,
  } = useGlobalContext();
  useEffect(() => {
    const closeConnection = () => {
      if (thesisSocket.current) {
        thesisSocket.current.close();
        thesisSocket.current = undefined;
      }
    };
    if (userDetails) {
      closeConnection();
      const socket = io();
      thesisSocket.current = socket;
      auth.currentUser
        ?.getIdToken()
        .then((token) => readSocket(token))
        .then(() => {
          socket.on("thesis-changes", (changeStream) => {
            switch (changeStream.operationType) {
              case "delete": {
                removeThesisItem(changeStream.documentKey._id);
                break;
              }
              case "insert": {
                addThesisItem(changeStream.document);
                break;
              }
            }
          });
        });
    }
    return () => closeConnection();
  }, [userDetails, globalState.thesisItems]);

  useEffect(() => {
    const closeConnection = () => {
      if (userSocketRef.current) {
        userSocketRef.current.close();
        userSocketRef.current = undefined;
      }
    };
    if (userDetails) {
      closeConnection();
      const socket = io();
      userSocketRef.current = socket;
      auth.currentUser
        ?.getIdToken()
        .then((token) => readSocket(token))
        .then(() => {
          socket.on("user-changes", () => {
            loadAllUsers();
          });
        });
    }
    return () => closeConnection();
  }, []);

  return <>{children}</>;
};

export default WatchChanges;
