import useUserContext from "@/context/userContext";
import { auth } from "@/lib/firebase";
import { addPendingInvite, addUserAccount } from "@/utils/account";
import { Avatar, Dropdown, Form, Input, Menu, MenuProps, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import axios from "axios";
import { sendSignInLinkToEmail } from "firebase/auth";
import { ObjectId } from "mongodb";
import Link from "next/link";
import router from "next/router";
import React, { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { BsPersonFillAdd } from "react-icons/bs";
import { GrUserSettings } from "react-icons/gr";
import { RiDashboardLine } from "react-icons/ri";
import { PriButton } from "./button";
import SignInSignUp from "./signin_signup";
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

export const AdminMenu = ({
  position,
}: {
  position?: "bottomLeft" | "bottomRight" | "bottomCenter";
}) => {
  const userCtxState = useUserContext().state;
  const userMenu: MenuProps["items"] = [
    {
      key: "/account-setting",
      icon: (
        <Link href={"/account-setting"}>
          <GrUserSettings size={"1.25em"} />
        </Link>
      ),
      label: <Link href={"/account-setting"}>Account Setting</Link>,
    },
    {
      key: "/dashboard/overview",
      icon: (
        <Link href={"/dashboard/overview"}>
          <RiDashboardLine size={"1.25em"} />
        </Link>
      ),
      label: <Link href={"/dashboard/overview"}>Dashboard</Link>,
    },
    {
      key: "logout",
      icon: <BiLogOut />,
      label: "Logout",
      onClick: () => {
        auth.signOut();
        router.push("/");
      },
    },
  ];
  return (
    <Dropdown
      // placement={(position as any) ?? "bottom"}
      trigger={["click"]}
      dropdownRender={() => (
        <div className="bg-white rounded-md pt-5 shadow-md">
          <div className="flex gap-2 justify-center items-center mx-5 pb-3 border-b-[1px]">
            <SignInSignUp />
            <div>
              <p>{`${userCtxState.userDetails?.firstName} ${userCtxState.userDetails?.lastName}`}</p>
              <p className="text-[0.8em] opacity-80">
                {userCtxState.userDetails?.course}
              </p>
            </div>
          </div>
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
  const [form] = useForm();
  const updateData = useUserContext().setTrigger;
  const onFinish = async ({ email }: any) => {
    try {
      const id: string = (await addPendingInvite(email)) as any;
      const actionCodeSettings = {
        url: `${process.env.PUBLIC_DOMAIN}/sign-up/${id}`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      updateData();
      message.success("Invite Sent");
      form.resetFields();
    } catch (e) {
      message.error("Invite failed");
      console.log(e);
    }
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

export default AdminProfile;
