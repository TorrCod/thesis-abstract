import Link from "next/link";
import { useEffect, useState } from "react";
import { PriButton } from "./button";
import { NavItemProps } from "./types.d";
import { AiOutlineHome } from "react-icons/ai";
import { BiGroup, BiLogOut } from "react-icons/bi";
import { BsBook } from "react-icons/bs";
import { Button, Divider, Drawer, Dropdown, Menu, MenuProps } from "antd";
import { FaBars } from "react-icons/fa";
import { useLocation, useWindowScroll } from "react-use";
import Search from "./search";
import Login from "./signin_signup";
import useUserContext from "@/context/userContext";
import { RiDashboardLine } from "react-icons/ri";
import { GrUserSettings } from "react-icons/gr";
import { auth } from "@/lib/firebase";

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
    onClick: () => {
      auth.signOut();
    },
  },
];

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { y } = useWindowScroll();
  const [active, setActive] = useState("/");
  const { pathname } = useLocation();
  const userCtx = useUserContext().state;

  useEffect(() => {
    if (pathname) {
      setActive(pathname);
    }
  }, [pathname]);

  return (
    <div
      className={
        "px-2 py-5 fixed md:flex top-0 z-50 w-full md:justify-center md:items-center " +
        (y > 0 ? "shadow-md flex bg-[#38649C] " : "md:bg-transparent ")
      }
    >
      <div className="md:hidden flex relative w-full gap-5">
        <Button
          className="flex justify-center place-items-center text-3xl w-fit md:hidden auto-rows-fr"
          type="ghost"
          icon={<FaBars />}
          style={{ color: "rgba(255, 255, 255, 0.80)" }}
          onClick={() => setOpen(!open)}
        />
        {y > 60 ? <Search className="w-full" /> : <></>}
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

        {userCtx.userDetails ? (
          <Dropdown
            placement="bottom"
            trigger={["click"]}
            dropdownRender={() => (
              <div className="bg-white rounded-md pt-5">
                <div className="flex gap-2 justify-center items-center mx-5 pb-3 border-b-2">
                  <Login />
                  <div>
                    <p>{`${userCtx.userDetails?.firstName} ${userCtx.userDetails?.lastName}`}</p>
                    <p className="text-[0.8em] opacity-80">
                      {userCtx.userDetails?.course}
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
              <Login />
            </div>
          </Dropdown>
        ) : (
          <Login />
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
          className="text-lg text-black/70"
          onClick={() => setOpen(!open)}
          selectedKeys={[active]}
          items={items}
        />
        <Divider />
        <div className="m-auto text-center">
          <Login />
        </div>
        {userCtx.userDetails ? (
          <Menu
            selectedKeys={[active]}
            className="opacity-70 text-lg"
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
