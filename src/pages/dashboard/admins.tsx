import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import DashboardLayout from "@/components/dashboardLayout";
import QuerySearch from "@/components/QuerySearch";
import { PriButton } from "@/components/button";
import { AddAdmin } from "@/components/admin";
import { getAllUsers } from "@/utils/account";
import useUserContext from "@/context/userContext";
import { UserDetails } from "@/context/types.d";

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

type AdminData = {
  key: string;
  name?: string;
  dateAdded: string;
  email: string;
  course?: string;
  status: React.ReactNode;
}[];

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

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Date Added",
    dataIndex: "dateAdded",
    key: "dateAdded",
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
    title: "Status",
    dataIndex: "status",
    key: "status",
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

export const AdminTable = ({ noAction }: { noAction?: boolean }) => {
  const [dataCol, setDataCol] = useState(columns);
  const [data, setData] = useState<AdminData>([]);
  const userId = useUserContext().state.userDetails?.uid;
  useEffect(() => {
    getAllUsers(userId ?? "")
      .then(
        (res: {
          users: UserDetails[];
          pendingUsers: { payload: string; _id: string; createdAt: string }[];
        }) => {
          const admins: AdminData = res.users.map((item) => ({
            ...item,
            name: `${item.firstName} ${item.lastName}`,
            key: item._id ?? "",
            status: (
              <div className="grid bg-lime-500 place-items-center rounded-xl w-[6em] py-1 text-white">
                admin
              </div>
            ),
            dateAdded: item.dateAdded ?? "",
          }));

          const pendingAdmins: AdminData = res.pendingUsers.map((item) => ({
            ...item,
            email: item.payload,
            key: item._id,
            dateAdded: item.createdAt,
            status: (
              <div className="grid bg-amber-400 place-items-center rounded-xl w-[6em] py-1 text-white">
                pending
              </div>
            ),
          }));

          setData([...admins, ...pendingAdmins]);
        }
      )
      .catch((res) => {
        message.error((res as Error).message);
      });
  }, []);

  useEffect(() => {
    if (noAction) {
      const oldDataCol = [...dataCol];
      const newDataCol = oldDataCol.filter((item) => item.key !== "action");
      setDataCol(newDataCol);
    }
  }, [noAction, columns]);

  return <Table columns={dataCol} dataSource={data} scroll={{ x: 50 }} />;
};

export default DashboardAdmin;
