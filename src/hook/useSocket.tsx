import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import recycledThesis from "@/pages/api/recycled-thesis";
import useGlobalContext from "@/context/globalContext";
import useUserContext from "@/context/userContext";

let recycled: any | null = null;
const useSocket = () => {
  const { loadUser, state: userState } = useUserContext();
  const {
    loadThesisItems,
    recycledThesis,
    state: globalState,
  } = useGlobalContext();

  const socketRef = useRef<
    | (() => Promise<Socket<DefaultEventsMap, DefaultEventsMap>> | null)
    | undefined
  >(undefined);

  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  useEffect(() => {
    if (userState.userDetails?.uid) {
      recycled = recycledThesis(userState.userDetails?.uid);
      recycled.load();
    }
    if (typeof socketRef.current !== "object" && socket === null) {
      socketRef.current = async () => {
        console.log("socket registered");
        await axios.get("/api/socket");
        const socket = io();
        socket.on("account-update", (msg) => {
          loadUser(userState.userDetails?.uid ?? "");
        });
        socket.on("thesis-abstract-update", () => {
          console.log("thesis abstract update");
          loadThesisItems();
          recycled.load();
        });
        return socket;
      };
      socketRef.current()?.then((mySocket) => {
        setSocket(mySocket);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState.userDetails?.uid]);

  const clearSocket = () => {
    socket?.disconnect();
    (socketRef.current as any) = null;
    recycled?.clear();
  };

  return { socket, clearSocket };
};

export default useSocket;
