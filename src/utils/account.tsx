import { UserDetails } from "@/context/types.d";
import { MongoDetails, QueryPost } from "@/lib/types";
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
  const userDetails = await axios.post("/api/getUser", {
    _id: id,
  });
  if (!userDetails.data.error) return userDetails.data;
  else {
    throw new Error("No Data");
  }
};

export const updateUser = async (payload: UserDetails) => {
  const res = await axios.post("/api/updateUser", payload);
  return res;
};

export const findUser = (_id: string, arr: UserDetails[]) =>
  arr.filter((item) => item.uid === _id);

export const utils_Delete_Account = async (userDetails: UserDetails) => {
  const mongoQuery: QueryPost = {
    data: userDetails,
    mongoDetails: { collectionName: "user", databaseName: "accounts" },
    query: { uid: userDetails.uid },
  };
  await axios.post("/api/remove-item-db", mongoQuery);
};
