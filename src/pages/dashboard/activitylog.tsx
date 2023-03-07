import React from "react";
import { Timeline, TimelineItemProps } from "antd";
import DashboardLayout from "@/components/dashboardLayout";

type Action = {
  label: string;
  children:
    | "deleted thesis abstracts"
    | "added thesis abstracts"
    | "rejected a user"
    | "approoved a user"
    | "removed an admin";
  color: "blue" | "red" | "green" | "gray";
};

const ActivityLog = () => {
  const activity = [
    {
      label: new Date("2022-01-01T00:00:00.000Z").toLocaleString(),
      children: "added thesis abstracts",
      color: "green",
    },
    {
      label: new Date("2022-01-02T00:00:00.000Z").toLocaleString(),
      children: "rejected a user",
      color: "red",
    },
    {
      label: new Date("2022-01-03T00:00:00.000Z").toLocaleString(),
      children: "approoved a user",
      color: "green",
    },
    {
      label: new Date("2022-01-04T00:00:00.000Z").toLocaleString(),
      children: "deleted thesis abstracts",
      color: "red",
    },
    {
      label: new Date("2022-01-05T00:00:00.000Z").toLocaleString(),
      children: "added thesis abstracts",
      color: "green",
    },
    {
      label: new Date("2022-01-06T00:00:00.000Z").toLocaleString(),
      children: "removed an admin",
      color: "red",
    },
    {
      label: new Date("2022-01-07T00:00:00.000Z").toLocaleString(),
      children: "approoved a user",
      color: "green",
    },
    {
      label: new Date("2022-01-08T00:00:00.000Z").toLocaleString(),
      children: "deleted thesis abstracts",
      color: "red",
    },
    {
      label: new Date("2022-01-09T00:00:00.000Z").toLocaleString(),
      children: "added thesis abstracts",
      color: "green",
    },
    {
      label: new Date("2022-01-10T00:00:00.000Z").toLocaleString(),
      children: "rejected a user",
      color: "red",
    },
  ];

  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/activitylog"
    >
      <h3 className="opacity-80 mb-3">Dashboard {">"} Activity Log</h3>
      <div className="bg-white rounded-md p-5 min-h-screen flex flex-col gap-2">
        <p className="opacity-60 mb-5">History</p>
        <Timeline mode="left" items={activity} />
      </div>
    </DashboardLayout>
  );
};

export default ActivityLog;
