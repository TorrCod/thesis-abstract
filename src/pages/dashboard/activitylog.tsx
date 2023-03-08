import React from "react";
import { Timeline, TimelineItemProps } from "antd";
import DashboardLayout from "@/components/dashboardLayout";
import { activity } from "@/data/dummydata";

const ActivityLog = () => {
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/activitylog"
    >
      <h3 className="opacity-80 mb-3">Dashboard {">"} Activity Log</h3>
      <div className="bg-white rounded-md p-5 flex flex-col gap-2">
        <p className="opacity-60 mb-5">History</p>
        <Timeline mode="left" items={activity} />
      </div>
    </DashboardLayout>
  );
};

export default ActivityLog;
