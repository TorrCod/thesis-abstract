import React, { useEffect, useState } from "react";
import { Timeline, TimelineItemProps } from "antd";
import DashboardLayout from "@/components/dashboardLayout";
import { activity } from "@/data/dummydata";
import useUserContext from "@/context/userContext";
import { MdEmail, MdRestore } from "react-icons/md";
import Link from "next/link";
import { BsBookmarkPlus, BsBookmarkX } from "react-icons/bs";
import { RiMailAddLine, RiMailCheckLine } from "react-icons/ri";
import {
  HiOutlineMinus,
  HiOutlineUser,
  HiOutlineUserMinus,
  HiOutlineUserPlus,
} from "react-icons/hi2";

const ActivityLog = () => {
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/activitylog"
    >
      <div className="opacity-80 mb-3">Dashboard {">"} Activity Log</div>
      <div className="bg-white rounded-md p-5 flex flex-col gap-2">
        <p className="opacity-60 mb-5">History</p>
        <ActivityTimeline />
      </div>
    </DashboardLayout>
  );
};

export const ActivityTimeline = ({ username }: { username?: string }) => {
  const [log, setLog] = useState<TimelineItemProps[]>([]);
  const userCtx = useUserContext();
  const { activityLog } = userCtx.state;

  useEffect(() => {
    const load = async () => {
      const newLog = activityLog.map((item) => {
        const setData = () => {
          let dot = undefined;
          let color = undefined;
          let reason = <></>;

          switch (item.reason) {
            case "invited an admin": {
              dot = (
                <div className="bg-[#f0c11a] rounded-full p-[3px]">
                  <HiOutlineUserPlus />
                </div>
              );
              color = "white";
              reason = (
                <Link href={`/dashboard/admins?_id=${item.data.itemId}`}>
                  {item.userName} {item.reason} ({item.data.name})
                </Link>
              );
              break; // <-- Add break statements for each case
            }
            case "accepted the invite": {
              dot = (
                <div className="bg-[#29de18] rounded-full p-[3px]">
                  <HiOutlineUser />
                </div>
              );
              color = "white";
              reason = (
                <Link href={`/dashboard/admins?_id=${item.data.itemId}`}>
                  {item.userName} {item.reason} ({item.data.name})
                </Link>
              );
              break;
            }
            case "removed a thesis": {
              dot = (
                <div className="bg-[#f54242] rounded-full p-[3px]">
                  <BsBookmarkX />
                </div>
              );
              color = "white";
              reason = (
                <Link
                  href={`/dashboard/thesis?tab=recyclebin&_id=${item.data.itemId}`}
                >
                  {item.userName} {item.reason} ({item.data.name})
                </Link>
              );
              break;
            }
            case "added a thesis": {
              dot = (
                <div className="bg-[#4287f5] rounded-full p-[3px]">
                  <BsBookmarkPlus />
                </div>
              );
              color = "white";
              reason = (
                <Link href={`/thesis/${item.data.itemId}`}>
                  {item.userName} {item.reason} ({item.data.name})
                </Link>
              );
              break;
            }
            case "restored a thesis": {
              dot = (
                <div className="bg-[#4287f5] rounded-full p-[3px]">
                  <MdRestore />
                </div>
              );
              color = "white";
              reason = (
                <Link href={`/thesis/${item.data.itemId}`}>
                  {item.userName} {item.reason} ({item.data.name})
                </Link>
              );
              break;
            }
            case "removed an admin": {
              dot = (
                <div className="bg-[#f54242] rounded-full p-[3px]">
                  <HiOutlineUserMinus />
                </div>
              );
              color = "white";
              reason = (
                <Link href={`/dashboard/admins?_id=${item.data.itemId}`}>
                  {item.userName} {item.reason} ({item.data.name})
                </Link>
              );
              break;
            }
            default: {
              return null; // <-- Add a default case that returns a default value
            }
          }

          return {
            label: new Date(item.date).toLocaleString(),
            children: <div>{reason}</div>,
            dot: dot,
            color: color,
          };
        };

        if (!username || username === item.userName) {
          return setData();
        }

        return null; // <-- Add a return statement outside the if statement to return a value in case the condition is not met
      });
      const newLogFiltered = newLog.filter((item) => item !== null);
      setLog(newLogFiltered as any);
    };
    load();
    return () => setLog([]);
  }, [activityLog, username]);

  return <Timeline mode="left" items={log} />;
};

export default ActivityLog;
