import {
  SearchOption,
  SearchQuery,
  ThesisCount,
  ThesisItems,
  ThesisState,
} from "@/context/types.d";
import axios from "axios";
import { userConfig } from "./account-utils";
import { stringifyURI } from "./helper";

export const getAllThesis = async (
  query?: SearchQuery,
  option?: SearchOption,
  pageNo?: number
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/public/thesis?${
      pageNo ? `pageNo=${pageNo}` : ``
    }${stringifyURI(query, option)}`
  );
  const data = res.data as ThesisState;
  return data;
};

export const getOneById = async (
  _id: string,
  projection?: Record<string, 1 | 0>
) => {
  const res = await axios.get(
    `${
      process.env.NEXT_PUBLIC_DOMAIN
    }/api/public/thesis?objective=get-one&_id=${_id}${
      projection
        ? `&projection=${encodeURIComponent(JSON.stringify(projection))}`
        : ``
    }`
  );
  const data = res.data as ThesisItems;
  return data;
};

export const getDistincYear = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/public/thesis?&objective=get-distinct-years`
  );
  const data = res.data as string[];
  return data;
};

export const getThesisCount = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/public/thesis?objective=get-thesis-count`
  );
  const data = res.data as { thesisCount: ThesisCount; totalCount: number };
  return data;
};

export const getAllDeletedThesis = async (
  token: string | undefined,
  query?: SearchQuery,
  option?: SearchOption
) => {
  const { title, year, course } = query || {};
  if (token) {
    const res = await axios.get(
      `/api/thesis-items?collection=deleted-thesis${
        title ? `&title=${title}` : ""
      }${
        course ? `&course=${encodeURIComponent(JSON.stringify(course))}` : ""
      }${year ? `&year=${encodeURIComponent(JSON.stringify(year))}` : ""}${
        option ? `&option=${encodeURIComponent(JSON.stringify(option))}` : ""
      }`,
      userConfig(token)
    );
    return res.data;
  } else throw new Error("canont read user token");
};

export const addThesis = async (
  data: ThesisItems,
  token: string | undefined
) => {
  if (token) await axios.post("/api/thesis-items", data, userConfig(token));
  else throw new Error("canont read user token");
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
    await axios.delete(`/api/thesis-items?_id=${thesisId}`, { ...config });
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
