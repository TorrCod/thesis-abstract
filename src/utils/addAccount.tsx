import { PostAccount } from "@/lib/types";

export const addUserAccount = async (userDetails: PostAccount) => {
  fetch("/api/addUser", {
    method: "POST",
    body: JSON.stringify(userDetails),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
};
