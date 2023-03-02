import { UserDetails } from "@/context/types.d";

export const addUserAccount = async (userDetails: UserDetails) => {
  fetch("/api/addUser", {
    method: "POST",
    body: JSON.stringify(userDetails),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
};

export const getUserDetails = async (id: string): Promise<UserDetails> => {
  const res = await fetch("/api/getUser", {
    method: "POST",
    body: JSON.stringify({ _id: id }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
  const userDetails = await res.json();
  return userDetails;
};

export const findUser = (_id: string, arr: UserDetails[]) =>
  arr.filter((item) => item.uid === _id);
