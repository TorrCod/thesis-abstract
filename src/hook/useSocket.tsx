import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import recycledThesis from "@/pages/api/recycled-thesis";
import useGlobalContext from "@/context/globalContext";
import useUserContext from "@/context/userContext";

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
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

  useEffect(() => {
    if (userState.userDetails?.uid) {
      recycled = recycledThesis(userState.userDetails?.uid);
      recycled.load();
    }
    if (typeof socketRef.current !== "object") {
      console.log("socket registered");
      socketRef.current = async () => {
        await axios.get("/api/socket");
        const socket = io();
        socket.on("account-update", (msg) => {
          loadUser(userState.userDetails?.uid ?? "");
        });
        socket.on("thesis-abstract-update", () => {
          console.log("thesis abstract update");
          loadThesisItems();
        });
        return socket;
      };
      socketRef.current()?.then((mySocket) => {
        socket = mySocket;
      });
    }
    return () => {
      socket?.disconnect();
      recycled?.clear();
      (socketRef.current as any) = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState.userDetails?.uid]);

  return { socket };
};

export default useSocket;
