import Link from "next/link";
import { useEffect, useState } from "react";
import { PriButton } from "./button";
import { NavItemProps } from "./types.d";
import { AiOutlineHome } from "react-icons/ai";
import { BiGroup } from "react-icons/bi";
import { BsBook } from "react-icons/bs";
import { Button, Divider, Drawer, Menu, MenuProps } from "antd";
import { FaBars } from "react-icons/fa";
import { useLocation, useWindowScroll } from "react-use";
import Search from "./search";

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
    key: "home",
    icon: (
      <Link href={"/"}>
        <AiOutlineHome size={"1.25em"} />
      </Link>
    ),
    label: "Home",
  },
  {
    key: "thesis",
    icon: (
      <Link href={"/thesis"}>
        <BsBook size={"1.25em"} />
      </Link>
    ),
    label: "Thesis",
  },
  {
    key: "about",
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

  const handleActive = (href: string) => setActive(href);

  return (
    <div
      className={
        "p-2 fixed md:block top-0 z-10 w-full " +
        (y > 60 ? "shadow-md flex bg-[#38649C] md:bg-transparent" : "")
      }
    >
      <div className="md:hidden">
        <Button
          className="flex justify-center place-items-center text-3xl w-fit md:hidden auto-rows-fr"
          type="ghost"
          icon={<FaBars />}
          style={{ color: "rgba(255, 255, 255, 0.80)" }}
          onClick={() => setOpen(!open)}
        />
        <Divider type="vertical" />
        {y > 60 ? <Search /> : ""}
      </div>
      <div className="hidden md:flex md:gap-10 text-white/70 place-content-center">
        {MENU_LIST.map(({ text, href, icon }, index) => (
          <div
            onClick={() => handleActive(href)}
            key={index}
            className={" " + (active === href ? "text-white" : "")}
          >
            <NavItem href={href} text={text} icon={icon} />
          </div>
        ))}
        <PriButton>Signin / Sign Up</PriButton>
      </div>
      <Drawer
        title="Thesis Abstract Management System"
        placement={"left"}
        open={open}
        onClose={() => setOpen(!open)}
        width={300}
        footer={<PriButton>Signin / Sign Up</PriButton>}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          className="text-lg text-black/70"
          onClick={() => setOpen(!open)}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          items={items}
        />
      </Drawer>
    </div>
  );
};

export default NavBar;
