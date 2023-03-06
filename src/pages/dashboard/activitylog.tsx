import React from "react";
import { Timeline } from "antd";
import DashboardLayout from "@/components/dashboardLayout";

const ActivityLog = () => {
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/activitylog"
    >
      <Timeline>
        <Timeline.Item color="green">Approved User</Timeline.Item>
        <Timeline.Item color="blue">Added Thesis</Timeline.Item>
        <Timeline.Item color="red">Removed Thesis</Timeline.Item>
      </Timeline>
    </DashboardLayout>
  );
};

export default ActivityLog;
