import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
const { Header, Content, Sider } = Layout;
import Link from "next/link";
import { PriButton } from "@/components/button";
import { MenuProps } from "antd";
import { AiFillHome } from "react-icons/ai";
import { FaSwatchbook } from "react-icons/fa";
import { MdAdminPanelSettings, MdWorkHistory } from "react-icons/md";
import { ImUserCheck } from "react-icons/im";
import { BotomMenu } from "@/components/botomMenu";
import { SelectedDashboardSider } from "@/components/types.d";
import { RiDashboardFill, RiUserSettingsFill } from "react-icons/ri";
import { useRouter } from "next/router";

type SelectedMenu = "/dashboard" | "/account-setting";

type DashboardProps = {
  children?: React.ReactNode;
  userSelectedMenu: SelectedMenu;
  userSelectedSider: SelectedDashboardSider;
};

function DashboardLayout({
  children,
  userSelectedMenu,
  userSelectedSider,
}: DashboardProps) {
  const [selectedSider, setSelectedSider] = useState(userSelectedSider);
  const router = useRouter();

  useEffect(() => {
    (
      document.getElementsByClassName("navbar")[0] as HTMLDivElement
    ).style.display = "none";
    return () => {
      (
        document.getElementsByClassName("navbar")[0] as HTMLDivElement
      ).style.display = "flex";
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
    {
      key: "/back",
      label: (
        <Link href="/">
          <PriButton style={{ marginLeft: "auto", marginRight: "40px" }}>
            Back
          </PriButton>
        </Link>
      ),
    },
  ];

  const siderMenu: MenuProps["items"] = [
    {
      key: "/dashboard/overview",
      label: <Link href={"/dashboard/overview"}>Overview</Link>,
      icon: <AiFillHome size={"1.1em"} />,
    },
    {
      key: "/dashboard/thesis",
      label: <Link href={"/dashboard/thesis"}>Thesis</Link>,
      icon: <FaSwatchbook size={"1.1em"} />,
    },
    {
      key: "/dashboard/users",
      label: <Link href={"/dashboard/users"}>Users</Link>,
      icon: <MdAdminPanelSettings size={"1.1em"} />,
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
    <div className="bg-[#D9D9D9] relative">
      <Header className="header fixed top-0 w-full md:relative">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[userSelectedMenu]}
          items={menuItem}
        />
      </Header>
      <div>
        {userSelectedMenu === "/dashboard" && (
          <div className="flex">
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
            <Content className="md:min-h-screen w-full mt-20 m-1 md:m-5 round-md">
              {children}
            </Content>
            <BotomMenu
              defaultSelected={selectedSider}
              onchange={(info) => {
                console.log(info);

                router.push(info);
              }}
            />
          </div>
        )}
        {userSelectedMenu === "/account-setting" && (
          <Content className="min-h-screen">{children}</Content>
        )}
      </div>
    </div>
  );
}

export default DashboardLayout;
