import userContext from "@/context/userContext";
import { readSocket } from "@/utils/socket-utils";
import { auth } from "@/lib/firebase";
import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import useGlobalContext from "@/context/globalContext";

const WatchChanges = ({ children }: { children: React.ReactNode }) => {
  const userDetails = userContext().state.userDetails;
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const {
    state: globalState,
    removeThesisItem,
    addThesisItem,
  } = useGlobalContext();
  useEffect(() => {
    const closeConnection = () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = undefined;
      }
    };
    if (userDetails) {
      closeConnection();
      const socket = io();
      socketRef.current = socket;
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
                // addThesisItem(changeStream.document);
                break;
              }
            }
          });
        });
    }
    return () => closeConnection();
  }, [userDetails, globalState.thesisItems]);

  return <>{children}</>;
};

export default WatchChanges;
