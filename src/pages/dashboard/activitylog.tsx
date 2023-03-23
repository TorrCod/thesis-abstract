import React, { ReactNode, useEffect, useState } from "react";
import { Timeline, TimelineItemProps } from "antd";
import DashboardLayout from "@/components/dashboardLayout";
import { activity } from "@/data/dummydata";
import useUserContext from "@/context/userContext";
import { MdEmail, MdMarkEmailRead } from "react-icons/md";
import Link from "next/link";
import { BsFillBookmarkCheckFill } from "react-icons/bs";

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
              dot = <MdEmail />;
              color = "#f5f189";
              reason = (
                <Link href={`/dashboard/admins?_id=${item.itemId}`}>
                  {item.userName} {item.reason}
                </Link>
              );
              break; // <-- Add break statements for each case
            }
            case "accepted the invite": {
              color = "#a0f589";
              reason = (
                <Link href={`/dashboard/admins?_id=${item.itemId}`}>
                  {item.userName} {item.reason}
                </Link>
              );
              break;
            }
            case "added a thesis": {
              dot = <BsFillBookmarkCheckFill />;
              color = "#4287f5";
              reason = (
                <Link href={`/thesis/${item.itemId}`}>
                  {item.userName} {item.reason}
                </Link>
              );
              break;
            }
            case "removed a thesis": {
              dot = <BsFillBookmarkCheckFill />;
              color = "#f54242";
              reason = (
                <Link href={`/dashboard/thesis/${item.itemId}`}>
                  {item.userName} {item.reason}
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
