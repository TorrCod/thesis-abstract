import React, { useEffect, useState } from "react";
import { Button, Layout, Menu } from "antd";
const { Header, Content, Sider } = Layout;
import Link from "next/link";
import { PriButton } from "@/components/button";
import { MenuProps } from "antd";
import { DashboardSetting } from "@/components/dasboardSetting";
import DashboardOverview from "@/components/dashboardOverview";
import { DashboardThesis } from "@/components/dashboardThesis";
import UsersTable from "@/components/dashboardUsers";
import AdminsTable from "@/components/dashboardAdmins";
import ActivityLog from "@/components/dashboardActivityLog";
import { AiFillHome } from "react-icons/ai";
import { FaSwatchbook } from "react-icons/fa";
import { MdAdminPanelSettings, MdWorkHistory } from "react-icons/md";
import { ImUserCheck } from "react-icons/im";

type SelectedKey =
  | "Overview"
  | "User"
  | "Deleted Thesis"
  | "Users"
  | "Admins"
  | "Activity Log"
  | "Thesis";

function Dashboard() {
  const [selectedMenu, setselectedMenu] = useState("/dashboard");
  const [selectedSider, setSelectedSider] = useState<SelectedKey>("Overview");

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
    { key: "/dashboard", label: <Link href="/dashboard">Dashboard</Link> },
    { key: "/setting", label: "Settings" },
    {
      key: "/back",
      label: (
        <Link href="/">
          <PriButton style={{ marginLeft: "auto", marginRight: "40px" }}>
            Home
          </PriButton>
        </Link>
      ),
    },
  ];

  const siderMenu: MenuProps["items"] = [
    { key: "Overview", label: "Overview", icon: <AiFillHome /> },
    { key: "Thesis", label: "Thesis", icon: <FaSwatchbook /> },
    { key: "Users", label: "Users", icon: <MdAdminPanelSettings /> },
    { key: "Admins", label: "Admins", icon: <ImUserCheck /> },
    { key: "Activity Log", label: "Activity Log", icon: <MdWorkHistory /> },
  ];

  return (
    <div className="bg-[#D9D9D9] relative">
      <Header className="header">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedMenu]}
          onSelect={(info) => setselectedMenu(info.key)}
          items={menuItem}
          defaultSelectedKeys={["/dashboard"]}
        />
      </Header>
      <div>
        {selectedMenu === "/dashboard" && (
          <div className="flex">
            <Sider
              className="md:bg-white z-10 hidden md:block opacity-80"
              width={200}
            >
              <Menu
                className="min-h-full"
                selectedKeys={[selectedSider]}
                onSelect={(info) => setSelectedSider(info.key as SelectedKey)}
                items={siderMenu}
              />
            </Sider>
            <Content className="min-h-screen w-full  m-1 md:m-5 round-md">
              {selectedSider === "Overview" && (
                <Content className="min-h-screen">
                  <DashboardOverview />
                </Content>
              )}
              {selectedSider === "Thesis" && (
                <Content className="min-h-screen">
                  <DashboardThesis />
                </Content>
              )}
              {selectedSider === "Deleted Thesis" && (
                <Content className="min-h-screen">Test1</Content>
              )}
              {selectedSider === "Users" && (
                <Content className="min-h-screen">
                  <UsersTable />
                </Content>
              )}
              {selectedSider === "Admins" && (
                <Content className="min-h-screen">
                  <AdminsTable />
                </Content>
              )}
              {selectedSider === "Activity Log" && (
                <Content className="min-h-screen" style={{ margin: "30px" }}>
                  <ActivityLog />
                </Content>
              )}
            </Content>
          </div>
        )}
        {selectedMenu === "/setting" && (
          <Content className="min-h-screen">
            <DashboardSetting />
          </Content>
        )}
      </div>
      <div className="md:hidden fixed bottom-0 w-full h-[4.5em] bg-[#001529] text-white grid grid-flow-col place-items-center">
        <FaSwatchbook />
        <MdAdminPanelSettings />
        <AiFillHome />
        <ImUserCheck />
        <MdWorkHistory />
      </div>
    </div>
  );
}

export default Dashboard;
