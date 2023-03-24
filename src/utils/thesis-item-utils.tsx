import { Course, SearchThesis, ThesisItems } from "@/context/types.d";
import axios from "axios";
import { userConfig } from "./account-utils";

export const getAllThesis = async (option?: SearchThesis) => {
  const { limit, title, year, course } = option || {};

  const res = await axios.get(
    `${
      process.env.NEXT_PUBLIC_DOMAIN
    }/api/thesis-items?collection=thesis-items&${
      title ? `title=${title}` : ""
    }&${course ? `course=${course}` : ""}&${year ? `year=${year}` : ""}&${
      limit ? `limit=${limit}` : ""
    }`
  );

  return res.data as { thesisItems: ThesisItems[]; distinctYear: number[] };
};

export const getAllDeletedThesis = async (token: string | undefined) => {
  if (token) {
    const res = await axios.get(
      "/api/thesis-items?collection=deleted-thesis",
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
