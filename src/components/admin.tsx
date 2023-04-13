import useUserContext from "@/context/userContext";
import { auth } from "@/lib/firebase";
import { inviteUser } from "@/utils/account-utils";
import { Avatar, Dropdown, Form, Input, Menu, MenuProps, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import { sendSignInLinkToEmail } from "firebase/auth";
import Link from "next/link";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { BsPersonFillAdd } from "react-icons/bs";
import { GrUserSettings } from "react-icons/gr";
import { RiDashboardLine } from "react-icons/ri";
import { PriButton } from "./button";
import SignInSignUp from "./signin_signup";
import { AdminProps } from "./types.d";
import { signOut as nextSignOut } from "next-auth/react";
import axios, { AxiosError } from "axios";
import useSocketContext from "@/context/socketContext";
import useGlobalContext from "@/context/globalContext";

function AdminProfile({ userDetails, size, src }: AdminProps) {
  return (
    <Avatar
      className={"h-12 w-12"}
      {...(size ? { style: { height: size.height, width: size.width } } : {})}
      src={src ?? userDetails?.profilePic ?? "/default-profile.png"}
    />
  );
}

export const AdminMenu = ({
  position,
}: {
  position?: "bottomLeft" | "bottomRight" | "bottomCenter";
}) => {
  const { logOut } = useUserContext();
  const userMenu: MenuProps["items"] = [
    {
      key: "/dashboard/account-setting",
      icon: (
        <Link href={"/dashboard/account-setting"}>
          <GrUserSettings size={"1.25em"} />
        </Link>
      ),
      label: <Link href={"/dashboard/account-setting"}>Account Setting</Link>,
    },
    {
      key: "/dashboard",
      icon: (
        <Link href={"/dashboard"}>
          <RiDashboardLine size={"1.25em"} />
        </Link>
      ),
      label: <Link href={"/dashboard"}>Dashboard</Link>,
    },
    {
      key: "logout",
      icon: <BiLogOut />,
      label: "Logout",
      onClick: logOut,
    },
  ];
  return (
    <Dropdown
      trigger={["click"]}
      dropdownRender={() => (
        <div className="bg-white rounded-md pt-5 shadow-md">
          <AdminDetails />
          <Menu
            className="opacity-80"
            style={{ boxShadow: "none" }}
            items={userMenu}
          />
        </div>
      )}
    >
      <div className="cursor-pointer">
        <SignInSignUp />
      </div>
    </Dropdown>
  );
};

export const AddAdmin = () => {
  const { state, refreshAdmin } = useUserContext();
  const userDetails = state.userDetails;
  const [form] = useForm();
  const { loadingState } = useGlobalContext();

  const onFinish = ({ email }: any) => {
    loadingState.add("admin-table");
    auth.currentUser
      ?.getIdToken()
      .then(async (token) => {
        const response = await inviteUser(token, {
          email: email,
          approove: `${userDetails?.userName}`,
        });
        const _id = response.addedData._id;
        if (!_id) throw new Error("undefined _id");
        const actionCodeSettings = {
          url: `${process.env.NEXT_PUBLIC_DOMAIN}/sign-up/${_id}`,
          handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        // await refreshAdmin();
        message.success("Invite Sent");
        form.resetFields();
      })
      .catch((e) => {
        const error: AxiosError = e;
        if ((error.response?.data as any).code === "email-duplicate") {
          message.error((error.response?.data as any).message);
        } else {
          console.error(e);
        }
      })
      .finally(() => loadingState.remove("admin-table"));
  };
  return (
    <div className="max-w-[20em]">
      <Form form={form} onFinish={onFinish} className="flex gap-2">
        <Form.Item
          name={"email"}
          rules={[
            {
              type: "email",
              message: "Not valid E-mail!",
            },
            {
              required: true,
              message: "Please input a E-mail!",
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item>
          <PriButton htmlType="submit">
            <BsPersonFillAdd />
            Invite
          </PriButton>
        </Form.Item>
      </Form>
    </div>
  );
};

export const AdminDetails = ({
  onClick,
}: {
  onClick?: () => void | Promise<void>;
}) => {
  const { state } = useUserContext();

  return (
    <>
      <Link
        onClick={onClick}
        className="flex gap-2 items-center mx-5 pb-3 border-b-[1px]"
        href={`/dashboard/admins?_id=${state.userDetails?._id}`}
      >
        <SignInSignUp />
        <div className={` ${!state.userDetails && "hidden"}`}>
          <p>{`${state.userDetails?.firstName} ${state.userDetails?.lastName}`}</p>
          <p className="text-[0.8em] opacity-80">{state.userDetails?.course}</p>
        </div>
      </Link>
    </>
  );
};

export default AdminProfile;
