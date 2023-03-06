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
import { BotomMenu } from "@/components/botomMenu";
import { SelectedKey } from "@/components/types.d";
import { RiDashboardFill, RiUserSettingsFill } from "react-icons/ri";
import useUserContext from "@/context/userContext";

type SelectedMenu = "/dashboard" | "/account-setting";

type DashboardProps = {
  children: React.ReactNode;
  onChange?: (selected: "/dashboard" | "/account-setting") => void;
  userSelectedMenu: SelectedMenu;
};

function Dashboard({ children, userSelectedMenu }: DashboardProps) {
  const [selectedMenu, setselectedMenu] = useState(
    userSelectedMenu ?? "/dashboard"
  );
  const [selectedSider, setSelectedSider] = useState<SelectedKey>("Overview");
  const userCtx = useUserContext();
  const user_id = userCtx.state.userDetails?._id;

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
      label: <Link href={"/dashboard/" + user_id}>Dashboard</Link>,
      icon: <RiDashboardFill />,
    },
    {
      key: "/account-setting",
      label: <Link href={"/account-setting/" + user_id}>Account Setting</Link>,
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
    { key: "Overview", label: "Overview", icon: <AiFillHome size={"1.1em"} /> },
    { key: "Thesis", label: "Thesis", icon: <FaSwatchbook size={"1.1em"} /> },
    {
      key: "Users",
      label: "Users",
      icon: <MdAdminPanelSettings size={"1.1em"} />,
    },
    { key: "Admins", label: "Admins", icon: <ImUserCheck size={"1.1em"} /> },
    {
      key: "Activity Log",
      label: "Activity Log",
      icon: <MdWorkHistory size={"1.1em"} />,
    },
  ];

  const handleBottomMenuChange = (selectedKey: SelectedKey) => {
    setSelectedSider(selectedKey);
  };

  return (
    <div className="bg-[#D9D9D9] relative">
      <Header className="header">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedMenu]}
          onSelect={(info) => setselectedMenu(info.key as SelectedMenu)}
          items={menuItem}
          defaultSelectedKeys={["/dashboard"]}
        />
      </Header>
      <div>
        {selectedMenu === "/dashboard" && (
          <div className="flex">
            <Sider
              className="md:bg-white z-10 hidden md:block opacity-80"
              width={"15vw"}
            >
              <Menu
                className="min-h-full text-[0.9vw]"
                selectedKeys={[selectedSider]}
                onSelect={(info) => setSelectedSider(info.key as SelectedKey)}
                items={siderMenu}
              />
            </Sider>
            <Content className="min-h-screen w-full  m-1 md:m-5 round-md">
              {/* {selectedSider === "Overview" && (
                <Content className="min-h-screen">
                  <DashboardOverview />
                </Content>
              )}
              {selectedSider === "Thesis" && (
                <Content className="min-h-screen">
                  <DashboardThesis />
                </Content>
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
              )} */}
              {children}
            </Content>
            <BotomMenu onchange={handleBottomMenuChange} />
          </div>
        )}
        {selectedMenu === "/account-setting" && (
          <Content className="min-h-screen">{children}</Content>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
