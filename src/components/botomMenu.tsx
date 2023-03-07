import React, { useEffect, useRef, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaSwatchbook } from "react-icons/fa";
import { ImUserCheck } from "react-icons/im";
import { MdAdminPanelSettings, MdWorkHistory } from "react-icons/md";
import { BottomMenuProps, SelectedDashboardSider } from "./types.d";

export const BotomMenu = ({ onchange, defaultSelected }: BottomMenuProps) => {
  const [selectedKeys, setSelectedKeys] =
    useState<SelectedDashboardSider>(defaultSelected);

  return (
    <div className="md:hidden fixed bottom-0 w-full h-[4.5em] bg-[#001529] text-white grid grid-flow-col place-items-center grid-col-4">
      <div
        onClick={() => {
          onchange(selectedKeys);
          setSelectedKeys("/dashboard/thesis");
        }}
        className={
          "relative w-full h-full grid place-items-center transition ease-out duration-200 " +
          (selectedKeys === "/dashboard/thesis" ? "bg-[#1677ff]" : "")
        }
      >
        <FaSwatchbook
          className={
            "text-xl ransition ease-out duration-200 " +
            (selectedKeys === "/dashboard/thesis" ? "scale-150" : "scale-100")
          }
        />
      </div>
      <div
        className={
          "relative w-full h-full grid place-items-center transition ease-out duration-200 " +
          (selectedKeys === "/dashboard/admins" ? "bg-[#1677ff]" : "")
        }
        onClick={() => {
          onchange(selectedKeys);
          setSelectedKeys("/dashboard/admins");
        }}
      >
        <MdAdminPanelSettings
          className={
            "text-xl transition ease-out duration-200 " +
            (selectedKeys === "/dashboard/admins" ? "scale-150" : "scale-100")
          }
        />
      </div>
      <div
        className={
          "relative w-full h-full grid place-items-center transition ease-out duration-200 " +
          (selectedKeys === "/dashboard/overview" ? "bg-[#1677ff]" : "")
        }
        onClick={() => {
          onchange(selectedKeys);
          setSelectedKeys("/dashboard/overview");
        }}
      >
        <AiFillHome
          className={
            "text-xl transition ease-out duration-200 " +
            (selectedKeys === "/dashboard/overview" ? "scale-150" : "scale-100")
          }
        />
      </div>
      <div
        className={
          "relative w-full h-full grid place-items-center transition ease-out duration-200 " +
          (selectedKeys === "/dashboard/users" ? "bg-[#1677ff]" : "")
        }
        onClick={() => {
          onchange(selectedKeys);
          setSelectedKeys("/dashboard/users");
        }}
      >
        <ImUserCheck
          className={
            "text-xl transition ease-out duration-200 " +
            (selectedKeys === "/dashboard/users" ? "scale-150" : "scale-100")
          }
        />
      </div>
      <div
        className={
          "relative w-full h-full grid place-items-center transition ease-out duration-200 " +
          (selectedKeys === "/dashboard/activitylog" ? "bg-[#1677ff]" : "")
        }
        onClick={() => {
          onchange(selectedKeys);
          setSelectedKeys("/dashboard/activitylog");
        }}
      >
        <MdWorkHistory
          className={
            "text-xl transition ease-out duration-200 " +
            (selectedKeys === "/dashboard/activitylog"
              ? "scale-150"
              : "scale-100")
          }
        />
      </div>
    </div>
  );
};
