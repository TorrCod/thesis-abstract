import { UserDetails } from "@/context/types.d";
import axios from "axios";

export const addUserAccount = async (userDetails: UserDetails) => {
  fetch("/api/addUser", {
    method: "POST",
    body: JSON.stringify(userDetails),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
};

export const getUserDetails = async (id: string): Promise<UserDetails> => {
  // const res = await fetch("/api/getUser", {
  //   method: "POST",
  //   body: JSON.stringify({ _id: id }),
  //   headers: {
  //     Accept: "application/json, text/plain, */*",
  //     "Content-Type": "application/json",
  //   },
  // });
  const userDetails = await axios.post("/api/getUser", {
    _id: id,
  });
  console.log(userDetails.data);
  // const userDetails = await res.json();
  return userDetails.data;
};

export const updateUser = async (payload: UserDetails) => {
  const res = await axios.post("/api/updateUser", payload);
  return res;
};

export const findUser = (_id: string, arr: UserDetails[]) =>
  arr.filter((item) => item.uid === _id);
