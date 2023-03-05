import { RcFile } from "antd/es/upload";

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
