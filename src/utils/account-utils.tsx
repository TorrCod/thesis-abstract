import {
  ActivitylogState,
  PendingAdminList,
  SearchOption,
  UserDetails,
} from "@/context/types.d";
import { ActivitylogReason } from "@/lib/types";
import axios from "axios";
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

export const checkEmail = async (
  token: string | undefined,
  email: string,
  option?: { projection: Record<string, 0 | 1> }
) => {
  if (token) {
    const res = await axios.get(
      `/api/admin-user?objective=check-email&email=${email}${
        option ? `&option=${encodeURIComponent(JSON.stringify(option))}` : ``
      }`,
      userConfig(token)
    );
    return res.data;
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
  query?: { userId?: string; _id?: string },
  option?: SearchOption,
  pageNo?: number,
  pageSize?: number
) => {
  if (token) {
    const activityLog = await axios.request({
      url: `/api/admin-user?objective=get-activitylog${
        pageNo ? `&pageNo=${pageNo}` : ``
      }${pageSize ? `&pageSize=${pageSize}` : ``}${stringifyUserUri(
        query,
        option
      )}`,
      method: "GET",
      ...userConfig(token),
    });
    return activityLog.data as ActivitylogState;
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

const stringifyUserUri = (
  query?: { userId?: string; _id?: string },
  option?: SearchOption
) => {
  const { userId, _id } = query || {};
  return `${userId ? `&userId=${userId}` : ``}${_id ? `&_id=${_id}` : ``}${
    option ? `&option=${encodeURIComponent(JSON.stringify(option))}` : ``
  }`;
};

// -----------------------------

export const findUser = (_id: string, arr: UserDetails[]) =>
  arr.filter((item) => item.uid === _id);
