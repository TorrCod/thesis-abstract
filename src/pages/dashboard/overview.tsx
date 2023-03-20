import { PriButton } from "@/components/button";
import DashboardLayout from "@/components/dashboardLayout";
import QuerySearch from "@/components/QuerySearch";
import { Course } from "@/context/types.d";
import { activity } from "@/data/dummydata";
import { Button, Card, Space, Statistic, Table, Timeline } from "antd";
import { ColumnsType } from "antd/lib/table";
import Head from "next/head";
import Link from "next/link";
import React, { Component } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BsBookFill } from "react-icons/bs";
import { GoLinkExternal } from "react-icons/go";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from "recharts";
import { AdminTable } from "./admins";
import { ThesisCharts } from "./thesis";

const DashboardOverview = () => {
  const totalData: { course: Course; count: number }[] = [
    { course: "Civil Engineer", count: 320 },
    { course: "Computer Engineer", count: 230 },
    { course: "Mechanical Engineer", count: 300 },
    { course: "Electronics Engineer", count: 257 },
    { course: "Electrical Engineer", count: 314 },
  ];

  return (
    <>
      <DashboardLayout
        userSelectedMenu="/dashboard"
        userSelectedSider="/dashboard/overview"
      >
        <h3 className="opacity-80 mb-3">Dashboard {">"} Overview</h3>

        <div className="dashboard-overview md:gap-2 w-full grid relative gap-2">
          <div className="bg-white rounded-md shadow-md thesis grid relative content-start">
            <Link className="grid w-fit" href={"/dashboard/thesis"}>
              <h3 className="opacity-80 mb-3 mx-5 pt-5">Thesis</h3>
              <div className="ml-6 opacity-60 flex items-center gap-2">
                Manage Thesis Abstracts <GoLinkExternal />
              </div>
            </Link>
            <div className="overflow-auto">
              <div className="h-96 min-w-[32em]">
                <ThesisCharts />
              </div>
            </div>
          </div>

          <div className=" admins bg-white rounded-md p-5 grid relative content-start gap-2">
            <Link className="grid w-fit" href={"/dashboard/admins"}>
              <h3 className="opacity-80 mb-3">Admins</h3>
            </Link>
            <Link href="/dashboard/admins">
              <div className="opacity-60 flex items-center gap-2 mb-5">
                Manage Co-Admins <GoLinkExternal />
              </div>
            </Link>
            <div className="overflow-auto">
              <AdminTable noAction />
            </div>
          </div>

          <div className="bg-white rounded-md p-5 flex flex-col gap-2 activitylog w-full overflow-auto">
            <Link className="w-fit" href={"/dashboard/activitylog"}>
              <h3 className="opacity-80 mb-3">Acitivity Log</h3>
              <p className="opacity-60 mb-5">History</p>
            </Link>
            <Timeline mode="left" items={activity} />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DashboardOverview;
