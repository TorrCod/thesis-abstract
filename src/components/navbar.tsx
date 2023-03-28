import Link from "next/link";
import { useEffect, useState } from "react";
import { NavItemProps } from "./types.d";
import { AiOutlineHome } from "react-icons/ai";
import { BiGroup, BiLogOut } from "react-icons/bi";
import { BsBook } from "react-icons/bs";
import { Button, Divider, Drawer, Menu, MenuProps } from "antd";
import { FaBars } from "react-icons/fa";
import { useLocation, useWindowScroll } from "react-use";
import Search from "./search";
import Login from "./signin_signup";
import useUserContext from "@/context/userContext";
import { RiDashboardLine } from "react-icons/ri";
import { GrUserSettings } from "react-icons/gr";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import { AdminMenu } from "./admin";

const MENU_LIST = [
  { text: "Home", href: "/", icon: <AiOutlineHome /> },
  { text: "Thesis", href: "/thesis", icon: <BsBook /> },
  { text: "About Us", href: "/aboutus", icon: <BiGroup /> },
];

const NavItem = (props: NavItemProps) => {
  return (
    <Link
      className="flex gap-2 justify-center items-center hover:text-white"
      {...props}
    >
      {props.icon}
      {props.text}
    </Link>
  );
};

const items: MenuProps["items"] = [
  {
    key: "/",
    icon: (
      <Link href={"/"}>
        <AiOutlineHome size={"1.25em"} />
      </Link>
    ),
    label: "Home",
  },
  {
    key: "/thesis",
    icon: (
      <Link href={"/thesis"}>
        <BsBook size={"1.25em"} />
      </Link>
    ),
    label: "Thesis",
  },
  {
    key: "/aboutus",
    icon: (
      <Link href={"/aboutus"}>
        <BiGroup size={"1.25em"} />
      </Link>
    ),
    label: "About us",
  },
];

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { y } = useWindowScroll();
  const [active, setActive] = useState("/");
  const { pathname } = useLocation();
  const userCtx = useUserContext();
  const userCtxState = userCtx.state;
  const router = useRouter();

  useEffect(() => {
    if (pathname) {
      setActive(pathname);
    }
  }, [pathname]);

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
    <div
      className={
        "navbar px-2 py-2 fixed md:flex top-0 z-50 w-full md:justify-center md:items-center " +
        (y > 0 ? "shadow-md flex bg-[#38649C] " : "md:bg-transparent ")
      }
    >
      <div className="md:hidden flex relative w-full gap-5 h-14">
        <Button
          className="flex justify-center place-items-center text-3xl w-fit md:hidden auto-rows-fr"
          type="ghost"
          icon={<FaBars />}
          style={{ color: "rgba(255, 255, 255, 0.80)" }}
          onClick={() => setOpen(!open)}
        />
        {y > 60 ? (
          <div className="absolute m-auto left-10">
            <Search limit={5} className="w-[85vw]" />{" "}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="hidden md:flex md:gap-10 text-white/70 align-center justify-center">
        {MENU_LIST.map(({ text, href, icon }, index) => (
          <div
            key={index}
            className={
              "flex align-center justify-center " +
              (active === href ? "text-white" : "")
            }
          >
            <NavItem href={href} text={text} icon={icon} />
          </div>
        ))}

        {userCtxState.userDetails ? (
          <div className="flex gap-1 items-center justify-center">
            <AdminMenu />
          </div>
        ) : (
          <>
            <Login />
          </>
        )}
      </div>
      <Drawer
        placement={"left"}
        open={open}
        onClose={() => setOpen(!open)}
        width={300}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          className="md:text-lg text-black/70"
          onClick={() => setOpen(!open)}
          selectedKeys={[active]}
          items={items}
        />
        <Divider />
        <div className="flex gap-2 items-center mx-5 pb-3 border-b-[1px]">
          <Login />
          <div className={` ${!userCtxState.userDetails && "hidden"}`}>
            <p>{`${userCtxState.userDetails?.firstName} ${userCtxState.userDetails?.lastName}`}</p>
            <p className="text-[0.8em] opacity-80">
              {userCtxState.userDetails?.course}
            </p>
          </div>
        </div>
        {userCtxState.userDetails ? (
          <Menu
            selectedKeys={[active]}
            className="opacity-80 md:text-lg"
            items={userMenu}
            onClick={() => setOpen(!open)}
          />
        ) : (
          ""
        )}
      </Drawer>
    </div>
  );
};

export default NavBar;
