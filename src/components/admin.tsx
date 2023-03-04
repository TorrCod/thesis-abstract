import { UserDetails } from "@/context/types.d";
import { Avatar } from "antd";
import React from "react";
import { AdminProps } from "./types.d";

function AdminProfile({ userDetails, size }: AdminProps) {
  return (
    <Avatar
      className={"h-12 w-12"}
      {...(size ? { style: { height: size.height, width: size.width } } : {})}
      src={userDetails["profilePic"] ?? "/default-profile.png"}
    />
  );
}

export default AdminProfile;
