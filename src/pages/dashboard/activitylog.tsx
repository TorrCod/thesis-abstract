import React, { useEffect, useState } from "react";
import { Timeline, TimelineItemProps } from "antd";
import DashboardLayout from "@/components/dashboardLayout";
import { activity } from "@/data/dummydata";
import useUserContext from "@/context/userContext";

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

export const ActivityTimeline = () => {
  const [log, setLog] = useState<TimelineItemProps[]>([]);
  const { activityLog } = useUserContext().state;

  useEffect(() => {
    const load = async () => {
      const newLog: TimelineItemProps[] = activityLog.map((item) => {
        return {
          label: new Date(item.date).toLocaleString(),
          children: (
            <div>
              {item.userName} {item.reason}
            </div>
          ),
        };
      });
      setLog(newLog);
    };
    load();
  }, []);

  return <Timeline mode="left" items={log} />;
};

export default ActivityLog;
