import { PendingAdminList, ThesisItems, UserDetails } from "@/context/types.d";
import { AddPost, MongoDetails, QueryPost } from "@/lib/types";
import axios, { AxiosError } from "axios";

export const userConfig = (token: string) => ({
  headers: { authorization: `Bearer ${token}` },
});

export const addUserAccount = async (token: string, data: any) => {
  if (token) {
    const userDetails = (
      await axios.request({
        url: `/api/admin-user?collection=user&objective=signup`,
        data: data,
        method: "POST",
        ...userConfig(token),
      })
    ).data;
    return userDetails;
  } else throw new Error("canont read user token");
};

export const getUserDetails = async (token: string, uid: string) => {
  if (token) {
    const res = await axios.get(
      `/api/admin-user?collection=user&uid=${uid}`,
      userConfig(token)
    );
    return res.data[0];
  } else throw new Error("canont read user token");
};

export const inviteUser = async (token: string | undefined, data: any) => {
  if (token) {
    const insertResult = await axios.request({
      url: `/api/admin-user?collection=pending&objective=invite-user`,
      data: data,
      method: "POST",
      ...userConfig(token),
    });
    return insertResult.data;
  } else throw new Error("canont read user token");
};

export const removePending = async (token: string | undefined, id: string) => {
  if (token) {
    const deleteResult = await axios.request({
      url: `/api/admin-user?collection=pending&_id=${id}`,
      method: "DELETE",
      ...userConfig(token),
    });
    return deleteResult.data;
  } else throw new Error("canont read user token");
};

export const deleteAdmin = async (token: string | undefined, id: string) => {
  if (token) {
    const deleteResult = await axios.request({
      url: `/api/admin-user?collection=user&_id=${id}`,
      method: "DELETE",
      ...userConfig(token),
    });
    return deleteResult.data;
  } else throw new Error("canont read user token");
};

export const updateUser = async (
  token: string | undefined,
  id: string,
  data: UserDetails
) => {
  if (token) {
    delete data._id;
    const deleteResult = await axios.request({
      url: `/api/admin-user?collection=user&_id=${id}`,
      method: "PUT",
      data: data,
      ...userConfig(token),
    });
    return deleteResult.data;
  } else throw new Error("canont read user token");
};

export const firebase_admin_delete_user = async (
  token: string | undefined,
  email: string
) => {
  if (token) {
    const deleteResult = await axios.request({
      url: `/api/firebase-admin?email=${email}`,
      method: "DELETE",
      ...userConfig(token),
    });
    return deleteResult.data;
  } else throw new Error("canont read user token");
};

export const getAllUsers = async (token: string | undefined) => {
  if (token) {
    const response: {
      adminList: UserDetails[];
      pendingAdminList: PendingAdminList[];
    } = { adminList: [], pendingAdminList: [] };
    const pendingList = await axios.get(
      `/api/admin-user?collection=pending`,
      userConfig(token)
    );
    const adminList = await axios.get(
      `/api/admin-user?collection=user`,
      userConfig(token)
    );
    response.adminList = adminList.data;
    response.pendingAdminList = pendingList.data;
    return response;
  } else throw new Error("canont read user token");
};

// -----------------------------

export const findUser = (_id: string, arr: UserDetails[]) =>
  arr.filter((item) => item.uid === _id);
