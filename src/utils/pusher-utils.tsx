import axios from "axios";
import { userConfig } from "./account-utils";
import Pusher from "pusher-js";
import { UserDetails } from "@/context/types.d";

export const go_online = async (uid?: string, token?: string) => {
  if (!token || !uid) throw new Error("INSUFFICIENT PARAM");
  await axios.get(
    `/api/pusher?objective=on-signin&uid=${uid}`,
    userConfig(token)
  );
};

export const watchUserState = (callback: (userDetails: string) => void) => {
  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
    cluster: "ap1",
  });
  const channel = pusher.subscribe("online");
  const unsubscribe = () => pusher.unsubscribe("online");
  channel.bind("on-signin", callback);
  return unsubscribe;
};
