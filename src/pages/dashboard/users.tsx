import React from "react";
import { Form, Input, Space, Table } from "antd";
import DashboardLayout from "@/components/dashboardLayout";
import { PriButton } from "@/components/button";
import { BiSearch } from "react-icons/bi";
import QuerySearch from "@/components/QuerySearch";

const columns = [
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
    course: "Mechanical Engineering",
  },
  {
    key: "3",
    name: "Bob Smith",
    date: "2022-02-03",
    email: "bobsmith@example.com",
    course: "Civil Engineering",
  },
];

const UsersTable = () => (
  <DashboardLayout
    userSelectedMenu="/dashboard"
    userSelectedSider="/dashboard/users"
  >
    <div className="bg-white rounded-md p-2 min-h-screen flex flex-col gap-2">
      <QuerySearch
        onSearch={(e) => {
          console.log(e);
        }}
      />
      <Table columns={columns} dataSource={data} scroll={{ x: 50 }} />
    </div>
  </DashboardLayout>
);

export default UsersTable;
