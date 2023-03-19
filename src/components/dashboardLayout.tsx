import React, { useEffect, useRef, useState } from "react";
import { Dropdown, Layout, Menu } from "antd";
const { Header, Content, Sider } = Layout;
import Link from "next/link";
import { HomeButton } from "@/components/button";
import { MenuProps } from "antd";
import { AiFillHome } from "react-icons/ai";
import { FaSwatchbook } from "react-icons/fa";
import { MdAdminPanelSettings, MdWorkHistory } from "react-icons/md";
import { ImUserCheck } from "react-icons/im";
import { BotomMenu } from "@/components/botomMenu";
import { SelectedDashboardSider } from "@/components/types.d";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  RiDashboardFill,
  RiDashboardLine,
  RiUserSettingsFill,
} from "react-icons/ri";
import { useRouter } from "next/router";
import AdminProfile, { AdminMenu } from "./admin";
import { BsThreeDots } from "react-icons/bs";
import { useLocation, useWindowSize } from "react-use";
import Head from "next/head";
import useAuth from "@/hook/useAuth";
import useGlobalContext, { LoadingGlobal } from "@/context/globalContext";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import useUserContext from "@/context/userContext";
import useSocket from "@/hook/useSocket";

type SelectedMenu = "/dashboard" | "/account-setting";

type DashboardProps = {
  children?: React.ReactNode;
  userSelectedMenu: SelectedMenu;
  userSelectedSider?: SelectedDashboardSider;
  title?: React.ReactNode;
};

function DashboardLayout({
  children,
  userSelectedMenu,
  userSelectedSider,
}: DashboardProps) {
  const isLogin = useAuth();
  const [selectedSider, setSelectedSider] = useState(userSelectedSider);
  const [selectedMenu, setSelectedMenu] = useState(userSelectedMenu);
  const router = useRouter();
  const { width } = useWindowSize();
  const { pathname } = useLocation();
  const [isScreen, setIsScreen] = useState(false);
  const { clearSocket } = useSocket();

  useEffect(() => {
    if (width >= 768) {
      setIsScreen(true);
    } else {
      setIsScreen(false);
    }
  }, [width]);

  useEffect(() => {
    (
      document.getElementsByClassName("navbar")[0] as HTMLDivElement
    ).style.display = "none";
    (
      document.getElementsByClassName("bg-circle")[0] as HTMLDivElement
    ).style.display = "none";
    return () => {
      (
        document.getElementsByClassName("navbar")[0] as HTMLDivElement
      ).style.display = "flex";
      (
        document.getElementsByClassName("bg-circle")[0] as HTMLDivElement
      ).style.display = "grid";

      clearSocket();
    };
  }, []);

  const menuItem: MenuProps["items"] = [
    {
      key: "/dashboard",
      label: <Link href={"/dashboard/overview"}>Dashboard</Link>,
      icon: <RiDashboardFill />,
    },
    {
      key: "/account-setting",
      label: <Link href={"/account-setting"}>Account Setting</Link>,
      icon: <RiUserSettingsFill />,
    },
  ];

  const siderMenu: MenuProps["items"] = [
    {
      key: "/dashboard/overview",
      label: <Link href={"/dashboard/overview"}>Overview</Link>,
      icon: <RiDashboardFill size={"1.1em"} />,
    },
    {
      key: "/dashboard/thesis",
      label: <Link href={"/dashboard/thesis"}>Thesis</Link>,
      icon: <FaSwatchbook size={"1.1em"} />,
    },
    // {
    //   key: "/dashboard/users",
    //   label: <Link href={"/dashboard/users"}>Users</Link>,
    //   icon: <MdAdminPanelSettings size={"1.1em"} />,
    // },
    {
      key: "/dashboard/admins",
      label: <Link href={"/dashboard/admins"}>Admins</Link>,
      icon: <ImUserCheck size={"1.1em"} />,
    },
    {
      key: "/dashboard/activitylog",
      label: <Link href={"/dashboard/activitylog"}>Activity Log</Link>,
      icon: <MdWorkHistory size={"1.1em"} />,
    },
  ];

  return !isLogin ? (
    <LoadingGlobal loading={!isLogin} />
  ) : (
    <>
      <Head>
        <title>
          {pathname === "/account-setting" ? "Account Setting" : "Dashboard"}
        </title>
        <meta
          name="description"
          content="Web based Thesis Abstract Management System for College of Engineering"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="bg-[#D9D9D9] relative md:h-screen">
        <Header className="header fixed top-0 w-full md:relative z-20 flex gap-10 items-center">
          {isScreen ? (
            <Menu
              className="w-80"
              selectedKeys={[selectedMenu]}
              onSelect={(info) => setSelectedMenu(info.key as any)}
              theme="dark"
              mode="horizontal"
              items={menuItem}
            />
          ) : (
            <Dropdown
              trigger={["click"]}
              className="text-white"
              menu={{ items: menuItem, selectedKeys: [selectedMenu] }}
              placement="bottom"
            >
              <button>
                <BsThreeDots size={"1.5rem"} />
              </button>
            </Dropdown>
          )}
          <Link className="self-center" href="/">
            <HomeButton>Home</HomeButton>
          </Link>
        </Header>
        <div className="h-full">
          {userSelectedMenu === "/dashboard" && selectedSider && (
            <div className="flex md:h-full">
              <Sider
                className="md:bg-white z-10 hidden md:block opacity-80"
                width={"15vw"}
              >
                <Menu
                  className="min-h-full text-[0.9vw]"
                  selectedKeys={[selectedSider]}
                  items={siderMenu}
                  onSelect={(info) => setSelectedSider(info.key as any)}
                />
              </Sider>
              <div
                className="overflow-auto h-screen w-screen md:w-full
             md:pb-20 pt-20 md:pt-5 md:px-5 round-md relative px-2"
              >
                {children}
              </div>
              <BotomMenu
                defaultSelected={selectedSider}
                onchange={(info) => {
                  router.push(info);
                }}
              />
            </div>
          )}
          {userSelectedMenu === "/account-setting" && (
            <div className="overflow-auto h-full relative">{children}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
