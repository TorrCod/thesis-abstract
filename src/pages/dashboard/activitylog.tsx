import React, { ReactNode, useEffect, useState } from "react";
import { Timeline, TimelineItemProps } from "antd";
import DashboardLayout from "@/components/dashboardLayout";
import { activity } from "@/data/dummydata";
import useUserContext from "@/context/userContext";
import { MdEmail } from "react-icons/md";
import Link from "next/link";

const ActivityLog = () => {
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/activitylog"
    >
      <h3 className="opacity-80 mb-3">Dashboard {">"} Activity Log</h3>
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
        if (username && username !== item.userName) {
          return;
        }
        let dot = undefined;
        let color = undefined;
        let reason: ReactNode = <></>;
        switch (item.reason) {
          case "invited an admin": {
            dot = <MdEmail />;
            color = "green";
            reason = (
              <Link href={`/dashboard/admins?_id=${item.itemId}`}>
                {item.userName} {item.reason}
              </Link>
            );
          }
        }
        return {
          label: new Date(item.date).toLocaleString(),
          children: <div>{reason}</div>,
          dot: dot,
          color: color,
        };
      });
      setLog(newLog as any);
    };
    load();
    return () => setLog([]);
  }, [activityLog, username]);

  return <Timeline mode="left" items={log} />;
};

export default ActivityLog;
