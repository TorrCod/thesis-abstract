import { PriButton } from "@/components/button";
import DashboardLayout from "@/components/dashboardLayout";
import { Space } from "antd";
import Link from "next/link";
import React from "react";
import { BsFillSendCheckFill } from "react-icons/bs";

const Success = () => {
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/thesis"
    >
      <div className="opacity-80 mb-3">
        <Link href="/dashboard/overview">Dashboard</Link> {">"}
        <Link href="/dashboard/thesis">Thesis</Link> {">"} Upload
      </div>
      <div className="bg-white rounded-md shadow-md p-5 md:p-10 mb-20 relative pb-20 md:grid gap-x-20 max-w-xl m-auto text-center place-items-center gap-5">
        <BsFillSendCheckFill size={"3em"} />
        <h3>Abstract is uploaded successfully</h3>
        <Space>
          <Link href="/dashboard/overview">
            <PriButton>Back to Dashboard</PriButton>
          </Link>
          <Link href="/dashboard/thesis/upload-thesis">
            <PriButton>Upload Again</PriButton>
          </Link>
        </Space>
      </div>
    </DashboardLayout>
  );
};

export default Success;
