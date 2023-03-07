import React from "react";
import { Timeline } from "antd";
import DashboardLayout from "@/components/dashboardLayout";

const ActivityLog = () => {
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/activitylog"
    >
      <div className="bg-white rounded-md p-2 min-h-screen flex flex-col gap-2">
        <Timeline />
      </div>
    </DashboardLayout>
  );
};

export default ActivityLog;
