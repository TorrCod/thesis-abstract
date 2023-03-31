import React, { useEffect, useState } from "react";
import { Dropdown, Layout, Menu } from "antd";
const { Header, Sider } = Layout;
import Link from "next/link";
import { HomeButton } from "@/components/button";
import { MenuProps } from "antd";
import { FaSwatchbook } from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import { ImUserCheck } from "react-icons/im";
import { BotomMenu } from "@/components/botomMenu";
import { SelectedDashboardSider } from "@/components/types.d";
import { RiDashboardFill, RiUserSettingsFill } from "react-icons/ri";
import { useRouter } from "next/router";
import { BsThreeDots } from "react-icons/bs";
import { useLocation, useWindowSize } from "react-use";
import Head from "next/head";

type SelectedMenu = "/dashboard" | "/account-setting";

type DashboardProps = {
  children?: React.ReactNode;
  userSelectedMenu?: SelectedMenu;
  userSelectedSider?: SelectedDashboardSider;
  title?: React.ReactNode;
};

function DashboardLayout({
  children,
  userSelectedMenu,
  userSelectedSider,
}: DashboardProps) {
  const [selectedSider, setSelectedSider] = useState(userSelectedSider);
  const [selectedMenu, setSelectedMenu] = useState(userSelectedMenu);
  const [isScreen, setIsScreen] = useState(false);
  const { width } = useWindowSize();
  const { pathname } = useLocation();
  const router = useRouter();

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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const siderMenu: MenuProps["items"] = [
    {
      key: "/dashboard/overview",
      label: <Link href={"/dashboard"}>Overview</Link>,
      icon: <RiDashboardFill size={"1.1em"} />,
    },
    {
      key: "/dashboard/thesis",
      label: <Link href={"/dashboard/thesis"}>Thesis</Link>,
      icon: <FaSwatchbook size={"1.1em"} />,
    },
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

  return (
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
          <Link className="self-center" href="/">
            <HomeButton>Home</HomeButton>
          </Link>
        </Header>
        <div className="h-full">
          <div className="flex md:h-full">
            <Sider
              className="md:bg-white z-10 hidden md:block opacity-80"
              width={"15vw"}
            >
              <Menu
                className="min-h-full text-[0.9vw]"
                items={siderMenu}
                onSelect={(info) => setSelectedSider(info.key as any)}
              />
            </Sider>
            <div
              className="overflow-auto h-screen w-screen md:w-full
             md:pb-20 py-20 md:py-5 md:px-5 round-md relative px-2"
            >
              {children}
            </div>
            <BotomMenu
              onchange={(info) => {
                router.push(info);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
