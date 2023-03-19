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

export const thesisToDataType = (thesisItems: ThesisItems[]) => {
  const newData = thesisItems.map((item) => {
    const { id, title, course, dateAdded } = item;
    return { key: id, title, course, dateAdded };
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

export const removeThesisITems = async (_id: string) => {
  const payload: QueryPost = {
    data: "",
    query: { _id: _id },
    mongoDetails: {
      collectionName: "thesis-items",
      databaseName: "thesis-abstract",
    },
  };
  const data = (await axios.delete("/api/remove-item-db", { data: payload }))
    .data;
  return data;
};

export const getDeletedThesis = async (uid: string) => {
  const thesisItems: ThesisItems[] | null = await (
    await axios.get("/api/recycled-thesis", {
      headers: { Authorization: `Bearer ${uid}` },
    })
  ).data;
  return thesisItems;
};
