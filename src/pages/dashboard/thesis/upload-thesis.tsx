import DashboardLayout from "@/components/dashboardLayout";
import Link from "next/link";
import React from "react";

const UploadThesis = () => {
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/thesis"
    >
      <div className="opacity-80 mb-3">
        <Link href="/dashboard/overview">Dashboard</Link> {">"}
        <Link href="/dashboard/thesis">Thesis</Link> {">"} Upload
      </div>
      <div></div>
    </DashboardLayout>
  );
};

export default UploadThesis;
