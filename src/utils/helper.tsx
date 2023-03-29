import { ActivityLog, ThesisItems } from "@/context/types.d";
import { ActivitylogReason, GeneratedTextRes, QueryPost } from "@/lib/types";
import { RcFile } from "antd/es/upload";
import axios from "axios";
import Link from "next/link";
import { BsBookmarkPlus, BsBookmarkX } from "react-icons/bs";
import { HiOutlineUser, HiOutlineUserMinus } from "react-icons/hi2";
import { MdRemove, MdRestore } from "react-icons/md";
import { RiMailAddLine } from "react-icons/ri";

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

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const readActivityLogReason = (item: ActivityLog) => {
  let dot = undefined;
  let color = undefined;
  let reason = <></>;
  switch (item.reason) {
    case "invited an admin": {
      dot = (
        <div className="bg-[#f0c11a] rounded-full p-[3px]">
          <RiMailAddLine />
        </div>
      );
      color = "white";
      reason = (
        <Link href={`/dashboard/admins?_id=${item.data.itemId}`}>
          {item.userName} {item.reason} ({item.data.name})
        </Link>
      );
      break; // <-- Add break statements for each case
    }
    case "accepted the invite": {
      dot = (
        <div className="bg-[#29de18] rounded-full p-[3px]">
          <HiOutlineUser />
        </div>
      );
      color = "white";
      reason = (
        <Link href={`/dashboard/admins?_id=${item.data.itemId}`}>
          {item.userName} {item.reason} ({item.data.name})
        </Link>
      );
      break;
    }
    case "removed an admin": {
      dot = (
        <div className="bg-[#f54242] rounded-full p-[3px]">
          <HiOutlineUserMinus />
        </div>
      );
      color = "white";
      reason = (
        <Link href={`/dashboard/admins?_id=${item.data.itemId}`}>
          {item.userName} {item.reason} ({item.data.name})
        </Link>
      );
      break;
    }
    case "removed an invite": {
      dot = (
        <div className="bg-[#f54242] rounded-full p-[3px]">
          <MdRemove />
        </div>
      );
      color = "white";
      reason = (
        <div>
          {item.userName} {item.reason} ({item.data.name})
        </div>
      );
      break;
    }
    case "added a thesis": {
      dot = (
        <div className="bg-[#4287f5] rounded-full p-[3px]">
          <BsBookmarkPlus />
        </div>
      );
      color = "white";
      reason = (
        <Link href={`/thesis/${item.data.itemId}`}>
          {item.userName} {item.reason} ({item.data.name})
        </Link>
      );
      break;
    }
    case "removed a thesis": {
      dot = (
        <div className="bg-[#f54242] rounded-full p-[3px]">
          <BsBookmarkX />
        </div>
      );
      color = "white";
      reason = (
        <Link href={`/dashboard/thesis?tab=recyclebin&_id=${item.data.itemId}`}>
          {item.userName} {item.reason} ({item.data.name})
        </Link>
      );
      break;
    }
    case "restored a thesis": {
      dot = (
        <div className="bg-[#4287f5] rounded-full p-[3px]">
          <MdRestore />
        </div>
      );
      color = "white";
      reason = (
        <Link href={`/thesis/${item.data.itemId}`}>
          {item.userName} {item.reason} ({item.data.name})
        </Link>
      );
      break;
    }
    default: {
      return null; // <-- Add a default case that returns a default value
    }
  }
  return { dot, color, reason };
};
