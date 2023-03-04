import { UserDetails } from "@/context/types.d";
import { Avatar } from "antd";
import React from "react";

function AdminProfile({ userDetails }: { userDetails: UserDetails }) {
  return (
    <Avatar
      className="h-12 w-12"
      src={userDetails["profilePic"] ?? "/default-profile.png"}
    />
  );
}

export default AdminProfile;
