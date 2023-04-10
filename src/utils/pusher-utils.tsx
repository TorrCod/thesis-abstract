import axios from "axios";
import { userConfig } from "./account-utils";
import Pusher from "pusher-js";
import { UserDetails } from "@/context/types.d";

export const pusherInit = () =>
  new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
    cluster: "ap1",
  });

export const thesisUpdate = async (
  action: "remove" | "add" | "restore",
  uid?: string,
  token?: string
) => {
  if (!token || !uid) throw new Error("INSUFFICIENT PARAM");
  await axios.get(
    `/api/pusher?channel=thesis-update&uid=${uid}&action=${action}`,
    userConfig(token)
  );
};

// export const watchUserState = (
//   action: "remove" | "add" | "restore",
//   callback: (data: string) => void
// ) => {
//   const
//   const channel = pusher.subscribe(action);
//   const unsubscribe = () => pusher.unsubscribe("online");
//   channel.bind(action, callback);
//   return unsubscribe;
// };
