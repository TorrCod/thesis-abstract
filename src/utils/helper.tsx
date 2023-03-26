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
    const { _id, expireAfterSeconds, createdAt, dateAdded } = item;
    const expireDate = new Date(createdAt ?? "0");
    const secondsToAdd = expireAfterSeconds ?? 0;
    const millisecondsToAdd = secondsToAdd * 1000;
    expireDate.setTime(expireDate.getTime() + millisecondsToAdd);
    const localizedDateString = expireDate.toLocaleString();
    const dateAddedFormat = new Date(dateAdded).toLocaleString();
    return {
      ...item,
      key: _id!,
      dateAdded: dateAddedFormat,
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
