import DashboardLayout from "@/components/dashboardLayout";
import Link from "next/link";
import React from "react";

const UploadThesis = () => {
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/thesis"
    >
      <h3 className="opacity-80 mb-3">
        <Link href="/dashboard/overview">Dashboard</Link> {">"}
        <Link href="/dashboard/thesis">Thesis</Link> {">"} Upload
      </h3>
    </DashboardLayout>
  );
};

export default UploadThesis;
