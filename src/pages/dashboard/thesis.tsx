import { PriButton } from "@/components/button";
import DashboardLayout from "@/components/dashboardLayout";
import QuerySearch from "@/components/QuerySearch";
import { Course, ThesisItems } from "@/context/types.d";
import { thesisToDataType } from "@/utils/helper";
import { Button, Card, Divider, Form, Input, Statistic, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { BsBookFill } from "react-icons/bs";
import {
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import { ResponsiveContainer } from "recharts";

const dummyData: ThesisItems[] = [
  {
    id: "1",
    title: "Optimizing Resource Allocation in Cloud Computing",
    researchers: ["John Smith", "Emily Johnson"],
    course: "Computer Engineer",
    abstract:
      "This thesis proposes a novel resource allocation strategy in cloud computing...",
    date: "2022-05-20",
    dateAdded: "2022-05-22",
  },
  {
    id: "2",
    title: "Design and Fabrication of a Miniature Wind Turbine",
    researchers: ["David Lee", "Maria Rodriguez"],
    course: "Mechanical Engineer",
    abstract:
      "This thesis presents the design and fabrication process of a miniature wind turbine...",
    date: "2021-12-15",
    dateAdded: "2021-12-18",
  },
  {
    id: "3",
    title: "Efficient Power Management in Smart Grids",
    researchers: ["Michael Brown", "Sophia Hernandez", "Oliver Davis"],
    course: "Electrical Engineer",
    abstract:
      "This thesis proposes an efficient power management system for smart grids...",
    date: "2023-02-28",
    dateAdded: "2023-03-02",
  },
  {
    id: "4",
    title: "Evaluating the Performance of Different Concrete Mixtures",
    researchers: ["Liam Johnson", "Emma Thompson"],
    course: "Civil Engineer",
    abstract:
      "This thesis evaluates the performance of different concrete mixtures in various conditions...",
    date: "2022-08-10",
    dateAdded: "2022-08-12",
  },
  {
    id: "5",
    title: "Design and Implementation of a Home Automation System",
    researchers: ["Nathan Kim", "Ava Jones"],
    course: "Electronics Engineer",
    abstract:
      "This thesis presents the design and implementation process of a home automation system...",
    date: "2021-06-05",
    dateAdded: "2021-06-07",
  },
];

const DashboardThesis = () => {
  const totalData: { course: Course; count: number }[] = [
    { course: "Civil Engineer", count: 320 },
    { course: "Computer Engineer", count: 230 },
    { course: "Mechanical Engineer", count: 300 },
    { course: "Electronics Engineer", count: 257 },
    { course: "Electrical Engineer", count: 314 },
  ];

  // const data = [
  //   { name: "Page A", uv: getRandomInt(300, 500), pv: getRandomInt(2000, 2800), amt: getRandomInt(2000, 2800) }
  // ];
  type DataType = {
    key: string;
    title: string;
    dateAdded: string;
    course: Course;
  };

  const tableColumn: ColumnsType<DataType> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Link href={"/thesis/" + record.key}>{text}</Link>
      ),
    },
    {
      title: "Date Added",
      dataIndex: "dateAdded",
      key: "dateAdded",
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
        <Button
          className="flex justify-center gap-1"
          icon={<AiFillDelete size={"1.5em"} color="red" />}
          type="ghost"
        >
          Remove
        </Button>
      ),
    },
  ];

  const tableData: DataType[] = thesisToDataType(dummyData);

  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/thesis"
    >
      <div className="pb-20 m-auto relative">
        <h3 className="opacity-80 mb-3">Dashboard {">"} Thesis</h3>
        <div className="md:grid gap-2 lg:grid-cols-2 relative w-full">
          <div className="bg-white rounded-md shadow-md pt-7 mb-2 md:mb-0">
            <p className="ml-6 opacity-60">Course Count RadarChart</p>
            <div className="h-96 w-full relative overflow-auto">
              <div className="h-full w-full min-w-[32em]">
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
          <div className="grid md:grid-cols-2 gap-2">
            {totalData.map((child, index) => (
              <Card key={index} bordered={false}>
                <Statistic
                  title={child.course}
                  prefix={<BsBookFill size={"0.9em"} />}
                  value={child.count}
                />
              </Card>
            ))}
          </div>
        </div>
        <Divider />
        <div className="mt-5 bg-white grid gap-1 rounded-md p-5 overflow-auto">
          <p className="opacity-60 mb-5">Manage Thesis Abstracts</p>
          <QuerySearch onSearch={() => {}} />
          <Table
            className="min-w-[40em]"
            columns={tableColumn}
            dataSource={tableData}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardThesis;
