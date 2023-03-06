import { Avatar } from "antd";
import React from "react";
import { AdminProps } from "./types.d";

function AdminProfile({ userDetails, size, src }: AdminProps) {
  return (
    <Avatar
      className={"h-12 w-12"}
      {...(size ? { style: { height: size.height, width: size.width } } : {})}
      src={src ?? userDetails?.profilePic ?? "/default-profile.png"}
    />
  );
}

export default AdminProfile;
