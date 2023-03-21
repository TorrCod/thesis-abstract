import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import recycledThesis from "@/pages/api/recycled-thesis";
import useGlobalContext from "@/context/globalContext";
import useUserContext from "@/context/userContext";
import { auth } from "@/lib/firebase";

let recycled: any | null = null;
const useSocket = () => {
  const { loadUser, state: userState } = useUserContext();
  const {
    loadThesisItems,
    recycledThesis,
    state: globalState,
  } = useGlobalContext();
  const [connect, setConnect] = useState(false);

  const loadRecycleThesis = async () => {
    if (auth.currentUser) {
      auth.currentUser.getIdToken().then((token) => {
        recycled = recycledThesis(token);
        recycled.load();
      });
    }
  };

  const socketRef = useRef<(() => Promise<void> | null) | undefined>(undefined);
  const socketInstRef = useRef<
    Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  >(undefined);

  useEffect(() => {
    loadRecycleThesis();
    if (socketRef.current !== null && socketInstRef.current === undefined) {
      socketRef.current = async () => {
        await axios.get("/api/socket");
        const socket = io();
        socket.on("account-update", (msg) => {
          loadUser(userState.userDetails?.uid ?? "");
        });
        socket.on("thesis-abstract-update", () => {
          loadThesisItems();
          loadRecycleThesis();
        });
        (socketInstRef as any).current = socket;
      };
      if (connect && userState.userDetails) {
        socketRef.current?.()?.then(() => setConnect(true));
      } else {
        setConnect(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState.userDetails, connect]);

  const clearSocket = () => {
    if (socketInstRef.current?.connected) {
      socketInstRef.current?.disconnect();
      recycled?.clear();
    }
  };

  return { clearSocket };
};

export default useSocket;
