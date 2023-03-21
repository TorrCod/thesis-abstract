import { ThesisItems } from "@/context/types.d";
import axios from "axios";
import { userConfig } from "./account";

export const getAllDeletedThesis = async (token: string | undefined) => {
  if (token) {
    const res = await axios.get(
      "/api/thesis-items?container=deleted-thesis",
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
    await axios.delete("/api/thesis-items", { ...config, data: thesisId });
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
      url: "/api/thesis-items?method=RESTORE",
      data: thesisId,
      method: "DELETE",
      headers: config.headers,
    });
  } else throw new Error("canont read user token");
};
