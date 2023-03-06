import React, { useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaSwatchbook } from "react-icons/fa";
import { ImUserCheck } from "react-icons/im";
import { MdAdminPanelSettings, MdWorkHistory } from "react-icons/md";
import { BottomMenuProps, SelectedKey } from "./types.d";

export const BotomMenu = ({ onchange }: BottomMenuProps) => {
  const [selectedKeys, setSelectedKeys] = useState<SelectedKey>("Overview");
  useEffect(() => {
    onchange(selectedKeys);
  }, [selectedKeys]);
  return (
    <div className="md:hidden fixed bottom-0 w-full h-[4.5em] bg-[#001529] text-white grid grid-flow-col place-items-center grid-col-4">
      <div
        onClick={() => setSelectedKeys("Thesis")}
        className={
          "relative w-full h-full grid place-items-center transition ease-out duration-200 " +
          (selectedKeys === "Thesis" ? "bg-[#1677ff]" : "")
        }
      >
        <FaSwatchbook
          className={
            "text-xl ransition ease-out duration-200 " +
            (selectedKeys === "Thesis" ? "scale-150" : "scale-100")
          }
        />
      </div>
      <div
        className={
          "relative w-full h-full grid place-items-center transition ease-out duration-200 " +
          (selectedKeys === "Admins" ? "bg-[#1677ff]" : "")
        }
        onClick={() => setSelectedKeys("Admins")}
      >
        <MdAdminPanelSettings
          className={
            "text-xl transition ease-out duration-200 " +
            (selectedKeys === "Admins" ? "scale-150" : "scale-100")
          }
        />
      </div>
      <div
        className={
          "relative w-full h-full grid place-items-center transition ease-out duration-200 " +
          (selectedKeys === "Overview" ? "bg-[#1677ff]" : "")
        }
        onClick={() => setSelectedKeys("Overview")}
      >
        <AiFillHome
          className={
            "text-xl transition ease-out duration-200 " +
            (selectedKeys === "Overview" ? "scale-150" : "scale-100")
          }
        />
      </div>
      <div
        className={
          "relative w-full h-full grid place-items-center transition ease-out duration-200 " +
          (selectedKeys === "Users" ? "bg-[#1677ff]" : "")
        }
        onClick={() => setSelectedKeys("Users")}
      >
        <ImUserCheck
          className={
            "text-xl transition ease-out duration-200 " +
            (selectedKeys === "Users" ? "scale-150" : "scale-100")
          }
        />
      </div>
      <div
        className={
          "relative w-full h-full grid place-items-center transition ease-out duration-200 " +
          (selectedKeys === "Activity Log" ? "bg-[#1677ff]" : "")
        }
        onClick={() => setSelectedKeys("Activity Log")}
      >
        <MdWorkHistory
          className={
            "text-xl transition ease-out duration-200 " +
            (selectedKeys === "Activity Log" ? "scale-150" : "scale-100")
          }
        />
      </div>
    </div>
  );
};
