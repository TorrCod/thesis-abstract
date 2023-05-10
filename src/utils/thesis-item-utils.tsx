import {
  SearchOption,
  SearchQuery,
  ThesisCount,
  ThesisItems,
  ThesisState,
} from "@/context/types.d";
import axios, { CancelToken } from "axios";
import { userConfig } from "./account-utils";
import { stringifyURI } from "./helper";
import { auth } from "@/lib/firebase";

export const getAllThesis = async (
  query?: SearchQuery,
  option?: SearchOption,
  pageNo?: number,
  pageSize?: number,
  cancleToken?: CancelToken
) => {
  const authToken = await auth.currentUser?.getIdToken();
  if (!authToken) {
    throw new Error("undefined token");
  }
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/public/thesis?${
      pageNo ? `&pageNo=${pageNo}` : ``
    }${pageSize ? `&pageSize=${pageSize}` : ``}${stringifyURI(query, option)}`,
    { cancelToken: cancleToken, ...userConfig(authToken) }
  );
  const data = res.data as ThesisState;
  return data;
};

export const getOneById = async (
  _id: string,
  projection?: Record<string, 1 | 0>
) => {
  const authToken = await auth.currentUser?.getIdToken();
  if (!authToken) {
    throw new Error("undefined token");
  }
  const res = await axios.get(
    `${
      process.env.NEXT_PUBLIC_DOMAIN
    }/api/public/thesis?objective=get-one&_id=${_id}${
      projection
        ? `&projection=${encodeURIComponent(JSON.stringify(projection))}`
        : ``
    }`,
    { ...userConfig(authToken) }
  );
  const data = res.data as ThesisItems;
  return data;
};

export const getDistincYear = async () => {
  const authToken = await auth.currentUser?.getIdToken();
  if (!authToken) {
    throw new Error("undefined token");
  }
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/public/thesis?&objective=get-distinct-years`,
    { ...userConfig(authToken) }
  );
  const data = res.data as string[];
  return data;
};

export const getThesisCount = async () => {
  const authToken = await auth.currentUser?.getIdToken();
  if (!authToken) {
    throw new Error("undefined token");
  }
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/public/thesis?objective=get-thesis-count`,
    { ...userConfig(authToken) }
  );
  const data = res.data as { thesisCount: ThesisCount; totalCount: number };
  return data;
};

export const getAllDeletedThesis = async (
  token: string | undefined,
  query?: SearchQuery,
  option?: SearchOption,
  pageNo?: number,
  pageSize?: number
) => {
  if (token) {
    const res = await axios.get(
      `/api/thesis-items?collection=deleted-thesis${
        pageNo ? `&pageNo=${pageNo}` : ``
      }${pageSize ? `&pageSize=${pageSize}` : ``}${stringifyURI(
        query,
        option
      )}`,
      userConfig(token)
    );
    return res.data as ThesisState;
  } else throw new Error("canont read user token");
};

export const addThesis = async (
  data: ThesisItems,
  token: string | undefined
) => {
  if (!token) throw new Error("canont read user token");
  const res = await axios.post("/api/thesis-items", data, userConfig(token));
  return res.data;
};

export const removeThesis = async ({
  token,
  thesisId,
}: {
  thesisId: string;
  token: string | undefined;
}) => {
  if (token) {
    const config = userConfig(token);
    const response = await axios.delete(`/api/thesis-items?_id=${thesisId}`, {
      ...config,
    });
    return response.data as {
      nextItem?: ThesisItems;
      recycledItem: ThesisItems;
    };
  } else throw new Error("canont read user token");
};

export const restoreThesis = async ({
  token,
  thesisId,
}: {
  thesisId: string;
  token: string | undefined;
}) => {
  if (token) {
    const config = userConfig(token);
    await axios.request({
      url: `/api/thesis-items?method=RESTORE&_id=${thesisId}`,
      method: "DELETE",
      headers: config.headers,
    });
  } else throw new Error("canont read user token");
};
