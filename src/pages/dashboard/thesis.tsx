import DashboardLayout from "@/components/dashboardLayout";
import React from "react";

const DashboardThesis = () => {
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/thesis"
    >
      Thesis Dashboard
    </DashboardLayout>
  );
};

export default DashboardThesis;
