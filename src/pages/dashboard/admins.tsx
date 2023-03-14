import React, { useEffect, useState } from "react";
import { Table } from "antd";
import DashboardLayout from "@/components/dashboardLayout";
import QuerySearch from "@/components/QuerySearch";
import { PriButton } from "@/components/button";
import { AddAdmin } from "@/components/admin";

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

const DashboardAdmin = () => (
  <DashboardLayout
    userSelectedMenu="/dashboard"
    userSelectedSider="/dashboard/admins"
  >
    <h3 className="opacity-80 mb-3">Dashboard {">"} Admin</h3>
    <div className="bg-white rounded-md p-5 flex flex-col gap-2">
      <p className="opacity-60 mb-5">Manage Co-Admins</p>
      <AddAdmin />
      <QuerySearch
        onSearch={(e) => {
          console.log(e);
        }}
      />
      <AdminTable />
    </div>
  </DashboardLayout>
);

export const AdminTable = ({ noAction }: { noAction?: boolean }) => {
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
        <PriButton className="bg-[red] hover:bg-[red]/80">
          Remove Access
        </PriButton>
      ),
    },
  ];
  const [dataCol, setDataCol] = useState(columns);
  useEffect(() => {
    if (noAction) {
      const oldDataCol = [...dataCol];
      oldDataCol.pop();
      setDataCol(oldDataCol);
    }
  }, [noAction]);

  return <Table columns={dataCol} dataSource={data} scroll={{ x: 50 }} />;
};

export default DashboardAdmin;
