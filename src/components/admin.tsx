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
  const { state, logOut } = useUserContext();
  const userCtxState = state;
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
  const { state, loadAllUsers } = useUserContext();
  const userDetails = state.userDetails;
  const [form] = useForm();
  const { triggerSocket } = useSocketContext();
  const onFinish = async ({ email }: any) => {
    let id: string = "";
    try {
      const token = await auth.currentUser?.getIdToken();

      const inserResult = await inviteUser(token, {
        email: email,
        approove: `${userDetails?.userName}`,
      });
      id = inserResult.insertedId;
      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/sign-up/${id}`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      loadAllUsers();
      triggerSocket("account-update");
      message.success("Invite Sent");
      form.resetFields();
    } catch (e) {
      message.error((e as AxiosError).response?.data as string);
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

export const AdminDetails = ({ selectedMenu }: { selectedMenu: string }) => {
  const { state, logOut } = useUserContext();
  const [selectedKey, setSelectedKey] = useState(selectedMenu);

  useEffect(() => setSelectedKey(selectedMenu), [selectedMenu]);

  const accountMenu: MenuProps["items"] = [
    {
      key: "/dashboard/account-setting",
      label: <Link href={"/dashboard/account-setting"}>Account Setting</Link>,
      icon: <GrUserSettings />,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <BiLogOut />,
      onClick: logOut,
    },
  ];

  return (
    <>
      <div className="flex gap-2 items-center mx-5 pb-3 border-b-[1px]">
        <SignInSignUp />
        <div className={` ${!state.userDetails && "hidden"}`}>
          <p>{`${state.userDetails?.firstName} ${state.userDetails?.lastName}`}</p>
          <p className="text-[0.8em] opacity-80">{state.userDetails?.course}</p>
        </div>
      </div>
      <Menu
        className="text-[0.9vw] place-self-start"
        items={accountMenu}
        selectedKeys={[selectedKey]}
        onSelect={(item) => setSelectedKey(item.key)}
      />
    </>
  );
};

export default AdminProfile;
