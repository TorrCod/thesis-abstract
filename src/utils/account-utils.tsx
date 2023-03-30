import { PendingAdminList, ThesisItems, UserDetails } from "@/context/types.d";
import {
  ActivitylogReason,
  AddPost,
  MongoDetails,
  QueryPost,
} from "@/lib/types";
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

export const getUserDetails = async (
  token: string | undefined,
  uid: string,
  option?: { projection: Record<string, 0 | 1> }
) => {
  if (token) {
    const res = await axios.get(
      `/api/admin-user?collection=user&uid=${uid}${
        option ? `&option=${encodeURIComponent(JSON.stringify(option))}` : ``
      }`,
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

export const getAllUserName = async (token: string | undefined) => {
  if (token) {
    const deleteResult = await axios.request({
      url: `/api/admin-user?collection=user&objective=get-all-username`,
      method: "GET",
      ...userConfig(token),
    });
    return deleteResult.data as string[];
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

export const getUserActivitylog = async (
  token: string | undefined,
  id: string
) => {
  if (token) {
    const deleteResult = await axios.request({
      url: `/api/admin-user?collection=activity-log&_id=${id}`,
      method: "GET",
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

export const getActivityLog = async (
  token: string | undefined,
  option?: { limit?: number }
) => {
  if (token) {
    const activityLog = await axios.request({
      url: `/api/admin-user?objective=get-activitylog${
        option ? `&option=${encodeURIComponent(JSON.stringify(option))}` : ``
      }`,
      method: "GET",
      ...userConfig(token),
    });
    return activityLog.data;
  } else throw new Error("canont read user token");
};

export const customUpdateActivityLog = async (
  token: string | undefined,
  option: {
    reason: ActivitylogReason;
    itemId: string;
    date: Date;
    name: string;
  }
) => {
  if (!token) throw new Error("token is undefined");
  const updateResult = await axios.request({
    url: `/api/admin-user?objective=update-activity-log`,
    method: "POST",
    ...userConfig(token),
    data: option,
  });
  return updateResult.data;
};

// -----------------------------

export const findUser = (_id: string, arr: UserDetails[]) =>
  arr.filter((item) => item.uid === _id);
