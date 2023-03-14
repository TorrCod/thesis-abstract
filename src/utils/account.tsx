import { ThesisItems, UserDetails } from "@/context/types.d";
import { AddPost, MongoDetails, QueryPost } from "@/lib/types";
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
  try {
    const { data } = await axios.post("/api/getUser", { _id: id });
    if (data.error) throw new Error("No Data");
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch user details");
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

export const addThesis = async (data: ThesisItems) => {
  await axios.post("/api/addThesisItems", data);
};

export const addPendingInvite = async (email: string) => {
  try {
    const data = await axios.post("/api/invite-admin", {
      dbName: "accounts",
      colName: "pending",
      payload: email,
    } as AddPost);
    return data.data.response.insertedId;
  } catch (e) {
    console.error(e);
    throw new Error(e as any);
  }
};

export const removePending = async (email: string) => {
  const mongoQuery: QueryPost = {
    data: email,
    mongoDetails: { collectionName: "pending", databaseName: "accounts" },
    query: { payload: email },
  };
  await axios.post("/api/remove-item-db", mongoQuery);
};
