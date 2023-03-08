import { PriButton } from "@/components/button";
import DashboardLayout from "@/components/dashboardLayout";
import QuerySearch from "@/components/QuerySearch";
import { Course } from "@/context/types.d";
import { activity } from "@/data/dummydata";
import { Button, Card, Space, Statistic, Table, Timeline } from "antd";
import { ColumnsType } from "antd/lib/table";
import Link from "next/link";
import React, { Component } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BsBookFill } from "react-icons/bs";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from "recharts";

const DashboardOverview = () => {
  const totalData: { course: Course; count: number }[] = [
    { course: "Civil Engineer", count: 320 },
    { course: "Computer Engineer", count: 230 },
    { course: "Mechanical Engineer", count: 300 },
    { course: "Electronics Engineer", count: 257 },
    { course: "Electrical Engineer", count: 314 },
  ];

  const column = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <PriButton className="bg-[red] hover:bg-[red]/80">
          Remove Access
        </PriButton>
      ),
    },
  ];

  const userColumn = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space>
          <PriButton className="bg-[red] hover:bg-[red]/80">Reject</PriButton>
          <PriButton>Approove</PriButton>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      name: "John Doe",
      date: "2022-02-01",
      email: "johndoe@example.com",
      course: "Computer Engineering",
    },
    {
      key: "2",
      name: "Jane Doe",
      date: "2022-02-02",
      email: "janedoe@example.com",
      course: "Civil Engineering",
    },
    {
      key: "3",
      name: "Bob Smith",
      date: "2022-02-03",
      email: "bobsmith@example.com",
      course: "Electrical Engineering",
    },
  ];

  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/overview"
    >
      <h3 className="opacity-80 mb-3">Dashboard {">"} Overview</h3>

      <div className="dashboard-overview md:gap-2 w-full grid relative gap-2">
        <div className="bg-white rounded-md shadow-md thesis grid relative content-start">
          <Link className="grid w-fit" href={"/dashboard/thesis"}>
            <h3 className="opacity-80 mb-3 mx-5 pt-5">Thesis</h3>
            <p className="ml-6 opacity-60">Course Count RadarChart</p>
          </Link>
          <div className="overflow-auto">
            <div className="h-96 min-w-[32em]">
              <ResponsiveContainer width={"99%"} height="99%">
                <RadarChart outerRadius={90} data={totalData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="course" />
                  <Radar
                    name="Count"
                    dataKey="count"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className=" admins bg-white rounded-md p-5 grid relative content-start gap-2">
          <Link className="grid w-fit" href={"/dashboard/admins"}>
            <h3 className="opacity-80 mb-3">Admins</h3>
            <p className="opacity-60 mb-5">Manage Co-Admins</p>
          </Link>
          <div className="overflow-auto">
            <QuerySearch
              onSearch={(e) => {
                console.log(e);
              }}
            />
            <Table columns={column} dataSource={data} scroll={{ x: 50 }} />
          </div>
        </div>

        {/* <div className="bg-white rounded-md p-5 user grid content-start gap-2">
          <Link className="grid w-fit" href={"/dashboard/users"}>
            <h3 className="opacity-80 mb-3">User</h3>
            <p className="opacity-60 mb-5">Pending User Request</p>
          </Link>
          <div className="overflow-auto">
            <QuerySearch
              onSearch={(e) => {
                console.log(e);
              }}
            />
            <Table columns={userColumn} dataSource={data} scroll={{ x: 50 }} />
          </div>
        </div> */}

        <div className="bg-white rounded-md p-5 flex flex-col gap-2 activitylog w-full overflow-auto">
          <Link className="w-fit" href={"/dashboard/activitylog"}>
            <h3 className="opacity-80 mb-3">Acitivity Log</h3>
            <p className="opacity-60 mb-5">History</p>
          </Link>
          <Timeline mode="left" items={activity} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;
