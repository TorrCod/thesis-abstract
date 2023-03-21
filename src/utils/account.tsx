import { ThesisItems, UserDetails } from "@/context/types.d";
import { AddPost, MongoDetails, QueryPost } from "@/lib/types";
import axios, { AxiosError } from "axios";

export const userConfig = (token: string) => ({
  headers: { authorization: `Bearer ${token}` },
});

export const addUserAccount = async (userDetails: UserDetails) => {
  const res = await axios.post("/api/addUser", userDetails);
  return res.data;
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

export const utils_Delete_Account = async (_id: string) => {
  const mongoQuery: QueryPost = {
    data: _id,
    mongoDetails: { collectionName: "user", databaseName: "accounts" },
    query: { _id: _id },
  };
  await axios.post("/api/remove-item-db", mongoQuery);
};

export const firebase_admin_delete_user = async (
  email: string,
  uid: string
) => {
  const url = "/api/firebase-admin";
  try {
    const response = await axios.delete(url, {
      data: { email: email },
      headers: { Authorization: `Bearer ${uid}` },
    });
    return response.data;
  } catch (error) {
    if ((error as AxiosError).status === 400)
      throw new Error((error as AxiosError).response?.data as string);
    else throw new Error((error as AxiosError).response?.data as string);
  }
};

export const addPendingInvite = async (email: string, uid: string) => {
  try {
    const data = await axios.post("/api/invite-admin", {
      dbName: "accounts",
      colName: "pending",
      payload: { email: email, addedByUid: uid },
    } as AddPost);
    return data.data.response.insertedId;
  } catch (e) {
    console.error(e);
    throw new Error(e as any);
  }
};

export const removePending = async (id: string) => {
  const mongoQuery: QueryPost = {
    data: "",
    mongoDetails: { collectionName: "pending", databaseName: "accounts" },
    query: { _id: id },
  };
  await axios.post("/api/remove-item-db", mongoQuery);
};

export const getAllUsers = async (uid: string) => {
  try {
    const allUsers = await (
      await axios.get("/api/get-all-user", { headers: { uid: uid } })
    ).data;
    return allUsers;
  } catch (e) {
    console.error(e);
    throw new Error("failed to load data");
  }
};
