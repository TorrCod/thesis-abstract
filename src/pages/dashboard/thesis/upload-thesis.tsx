import DashboardLayout from "@/components/dashboardLayout";
import React from "react";

const UploadThesis = () => {
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/thesis"
    >
      <h3 className="opacity-80 mb-3">
        Dashboard {">"} Thesis {">"} Upload
      </h3>
    </DashboardLayout>
  );
};

export default UploadThesis;
