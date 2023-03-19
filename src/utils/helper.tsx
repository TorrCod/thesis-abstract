import { ThesisItems } from "@/context/types.d";
import { GeneratedTextRes, QueryPost } from "@/lib/types";
import { RcFile } from "antd/es/upload";
import axios from "axios";

export function isObjectIncluded(obj1: any, obj2: any) {
  return Object.entries(obj1).every(([key, value]) => obj2[key] === value);
}

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export function base64toBinaryData(base64String: string, fileName: string) {
  console.log(base64String);

  const file = Buffer.from(base64String, "base64");
  return file;
}

export const thesisToDataType = (
  thesisItems: (ThesisItems & {
    createdAt?: string;
    expireAfterSeconds?: number;
  })[]
) => {
  const newData = thesisItems.map((item) => {
    const { id, expireAfterSeconds, createdAt } = item;
    const date = new Date(createdAt ?? "0");
    const secondsToAdd = expireAfterSeconds ?? 0;
    const millisecondsToAdd = secondsToAdd * 1000;
    date.setTime(date.getTime() + millisecondsToAdd);
    const localizedDateString = date.toLocaleString();
    return {
      ...item,
      key: id,
      expireAt: expireAfterSeconds ? localizedDateString : undefined,
    };
  });
  return newData;
};

export const getPdfText = (data: GeneratedTextRes) => {
  const text_pages = (data as GeneratedTextRes).data.fields.text.text_pages;
  let extractedText = "";
  for (const content of text_pages) {
    extractedText = extractedText + content;
  }
  return extractedText;
};

export const getAllThesis = async () => {
  const thesisItems: ThesisItems[] = await (
    await axios.get("/api/getThesisItems")
  ).data;
  return thesisItems;
};

export const removeThesisITems = async (
  uid: string,
  thesisItem: ThesisItems
) => {
  // const data = await (
  //   await axios.post("/api/recycled-thesis", thesisItem, {
  //     headers: { Authorization: `Bearer ${uid}` },
  //   })
  // ).data;
  const data = await (
    await axios.delete("/api/recycled-thesis", {
      data: thesisItem,
      headers: { Authorization: `Bearer ${uid}` },
    })
  ).data;
  return data;
};

export const getDeletedThesis = async (uid: string) => {
  try {
    const thesisItems: ThesisItems[] = await (
      await axios.get("/api/recycled-thesis", {
        headers: { Authorization: `Bearer ${uid}` },
      })
    ).data;
    return thesisItems;
  } catch (e) {
    console.error((e as Error).message);
  }
};

export const restoreThesisAbstract = async (uid: string, id: string) => {
  const res = await axios.post(
    "/api/recycled-thesis",
    {
      _id: id,
    },
    {
      headers: { Authorization: `Bearer ${uid}` },
    }
  );
  return res.data;
};
