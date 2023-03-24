import { Course, ThesisItems } from "@/context/types.d";
import axios from "axios";
import { userConfig } from "./account-utils";

export const getAllThesis = async (option?: {
  limit?: number;
  course?: Course;
  year?: number;
  title?: string;
}) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/thesis-items?collection=thesis-items&limit=${option?.limit}&course=${option?.course}&year=${option?.year}&title=${option?.title}`
  );
  return res.data as ThesisItems[];
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
