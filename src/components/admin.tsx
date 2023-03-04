import { UserDetails } from "@/context/types.d";
import { Avatar } from "antd";
import React from "react";
import { AdminProps } from "./types.d";

function AdminProfile({ userDetails, size }: AdminProps) {
  return (
    <Avatar
      className={size ? `h-[${size.height}] w-[${size.width}]` : "h-12 w-12"}
      src={userDetails["profilePic"] ?? "/default-profile.png"}
    />
  );
}

export default AdminProfile;
