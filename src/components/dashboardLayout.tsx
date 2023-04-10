import React, { useEffect, useState } from "react";
import { Button, Divider, Drawer, Dropdown, Layout, Menu } from "antd";
const { Header, Sider } = Layout;
import Link from "next/link";
import { HomeButton } from "@/components/button";
import { MenuProps } from "antd";
import { FaBars, FaSwatchbook } from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import { ImUserCheck } from "react-icons/im";
import { BotomMenu } from "@/components/botomMenu";
import { RiDashboardFill, RiUserSettingsFill } from "react-icons/ri";
import { useRouter } from "next/router";
import { useLocation, useWindowSize } from "react-use";
import Head from "next/head";
import AdminProfile, { AdminDetails, AdminMenu } from "./admin";
import { GrUserSettings } from "react-icons/gr";
import { BiLogOut } from "react-icons/bi";
import useUserContext from "@/context/userContext";
import SignInSignUp from "./signin_signup";
import { AiFillHome } from "react-icons/ai";
import { IoHomeOutline } from "react-icons/io5";
import useGlobalContext from "@/context/globalContext";
import Pusher from "pusher-js";
import { pusherInit } from "@/utils/pusher-utils";
import {
  ActivityLog,
  ThesisCount,
  ThesisItems,
  UserDetails,
} from "@/context/types.d";

type DashboardProps = {
  children?: React.ReactNode;
};

const siderMenu: MenuProps["items"] = [
  {
    key: "/dashboard",
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

function DashboardLayout({ children }: DashboardProps) {
  const [selectedSider, setSelectedSider] = useState("/dashboard");
  const { pathname } = useLocation();
  const {
    logOut,
    state: userState,
    loadActivityLog,
    dispatch,
    loadAllUsers,
  } = useUserContext();
  const {
    clearDefault,
    loadThesisCount,
    state: globalState,
    addThesisItem,
    removeThesisItem,
    recycleThesis,
    restoreThesis,
    dispatch: globalDispatch,
  } = useGlobalContext();
  const [thesisUpdate, setThesisUpdate] = useState<{
    activityLog: ActivityLog;
    addedData: ThesisItems;
    thesisCharts: {
      thesisCount: ThesisCount;
      totalCount: number;
    };
  }>();
  const [adminUpdate, setAdminUpdate] = useState<{
    activityLog: ActivityLog;
  }>();
  const router = useRouter();

  useEffect(() => {
    const pusher = pusherInit();
    const thesisChannel = pusher.subscribe("thesis-update");
    thesisChannel.bind(
      "add-thesis",
      (res: {
        activityLog: ActivityLog;
        addedData: ThesisItems;
        thesisCharts: {
          thesisCount: ThesisCount;
          totalCount: number;
        };
      }) => {
        setThesisUpdate(res);
      }
    );
    thesisChannel.bind(
      "remove-thesis",
      (res: {
        activityLog: ActivityLog;
        addedData: ThesisItems;
        thesisCharts: {
          thesisCount: ThesisCount;
          totalCount: number;
        };
      }) => {
        setThesisUpdate(res);
      }
    );
    thesisChannel.bind(
      "restore-thesis",
      (res: {
        activityLog: ActivityLog;
        addedData: ThesisItems;
        thesisCharts: {
          thesisCount: ThesisCount;
          totalCount: number;
        };
      }) => {
        setThesisUpdate(res);
      }
    );

    const adminChannel = pusher.subscribe("admin-update");
    adminChannel.bind("update", (arg: { activityLog: ActivityLog }) => {
      setAdminUpdate(arg);
    });

    return () => {
      pusher.unsubscribe("thesis-update");
      adminChannel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (thesisUpdate) {
      switch (thesisUpdate.activityLog.reason) {
        case "added a thesis": {
          const isLogExist = userState.activityLog.document.filter(
            ({ _id }) => thesisUpdate.activityLog._id === _id
          )[0];
          const isThesisExist = globalState.thesisItems.document.filter(
            ({ _id }) => _id === thesisUpdate.addedData._id
          )[0];
          if (isLogExist || isThesisExist) return;
          addThesisItem(thesisUpdate.addedData);

          const newAL = { ...userState.activityLog };
          newAL.document.push(thesisUpdate.activityLog);
          dispatch({ type: "load-activity-log", payload: newAL });
          globalDispatch({
            type: "load-thesis-count",
            payload: thesisUpdate.thesisCharts,
          });
          break;
        }
        case "removed a thesis": {
          const isLogExist = userState.activityLog.document.filter(
            ({ _id }) => thesisUpdate.activityLog._id === _id
          )[0];
          const isReCycleExist = globalState.recyclebin.document.filter(
            ({ _id }) => _id === thesisUpdate.addedData._id
          )[0];
          if (isLogExist || isReCycleExist) return;
          removeThesisItem(thesisUpdate.activityLog.data.itemId);
          recycleThesis(thesisUpdate.addedData);

          const newAL = { ...userState.activityLog };
          newAL.document.push(thesisUpdate.activityLog);
          dispatch({ type: "load-activity-log", payload: newAL });
          globalDispatch({
            type: "load-thesis-count",
            payload: thesisUpdate.thesisCharts,
          });
          break;
        }
        case "restored a thesis": {
          const isLogExist = userState.activityLog.document.filter(
            ({ _id }) => thesisUpdate.activityLog._id === _id
          )[0];
          const isThesisExist = globalState.thesisItems.document.filter(
            ({ _id }) => _id === thesisUpdate.addedData._id
          )[0];
          if (isLogExist || isThesisExist) return;
          addThesisItem(thesisUpdate.addedData);
          restoreThesis(thesisUpdate.activityLog.data.itemId);
          const newAL = { ...userState.activityLog };
          newAL.document.push(thesisUpdate.activityLog);
          dispatch({ type: "load-activity-log", payload: newAL });
          globalDispatch({
            type: "load-thesis-count",
            payload: thesisUpdate.thesisCharts,
          });
          break;
        }
      }
    }
  }, [
    globalState.thesisItems,
    thesisUpdate,
    userState.activityLog,
    globalState.recyclebin,
  ]);

  useEffect(() => {
    if (adminUpdate) {
      const isLogExist = userState.activityLog.document.filter(
        ({ _id }) => adminUpdate.activityLog._id === _id
      )[0];
      if (isLogExist) return;
      loadAllUsers()
        .then(() => {
          const newAL = { ...userState.activityLog };
          newAL.document.push(adminUpdate.activityLog);
          dispatch({ type: "load-activity-log", payload: newAL });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userState.listOfAdmins, userState.activityLog, adminUpdate]);

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

      clearDefault();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectedSider(router.pathname);
  }, [router]);

  const handleSeletect: MenuProps["onSelect"] = (item) => {
    setSelectedSider(item.key);
  };

  const accountMenu: MenuProps["items"] = [
    {
      key: "/",
      label: <Link href={"/"}>Home</Link>,
      icon: <IoHomeOutline />,
    },
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

  useEffect(() => {
    if (userState.userDetails) {
      loadActivityLog();
      loadThesisCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState.userDetails]);

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
        <Header className="header fixed top-0 w-full md:relative z-20 flex gap-10 items-center justify-center md:justify-start">
          <div className="absolute left-5 md:hidden">
            <Dropdown
              trigger={["click"]}
              dropdownRender={() => (
                <div className="bg-white rounded-md pt-5 shadow-md">
                  <AdminDetails />
                  <Menu
                    className="opacity-80"
                    style={{ boxShadow: "none" }}
                    items={accountMenu}
                    selectedKeys={[selectedSider]}
                    onSelect={(item) => setSelectedSider(item.key)}
                  />
                </div>
              )}
            >
              <div>
                <SignInSignUp />
              </div>
            </Dropdown>
          </div>
          <Link className="self-center" href="/">
            <HomeButton>Home</HomeButton>
          </Link>
        </Header>
        <div className="h-full">
          <div className="flex md:h-full">
            <Sider
              className="md:bg-white z-10 hidden md:block opacity-80 relative"
              width={"15vw"}
            >
              <div className="">
                <Menu
                  selectedKeys={[selectedSider]}
                  className="place-self-start"
                  items={siderMenu}
                  onSelect={handleSeletect}
                />
                <Divider />

                <AdminDetails />

                <Menu
                  className="place-self-start"
                  items={accountMenu}
                  selectedKeys={[selectedSider]}
                  onSelect={(item) => setSelectedSider(item.key)}
                />
              </div>
            </Sider>
            <div
              id="layout-container"
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
