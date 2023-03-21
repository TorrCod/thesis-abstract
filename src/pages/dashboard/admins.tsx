import React, { useEffect, useRef, useState } from "react";
import { Form, Input, message, Modal, Popconfirm, Table } from "antd";
import DashboardLayout from "@/components/dashboardLayout";
import QuerySearch from "@/components/QuerySearch";
import { PriButton } from "@/components/button";
import { AddAdmin } from "@/components/admin";
import useUserContext from "@/context/userContext";
import { AdminData, UserDetails } from "@/context/types.d";
import { ColumnsType } from "antd/lib/table";
import Password from "antd/lib/input/Password";
import { useForm } from "antd/lib/form/Form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  firebase_admin_delete_user,
  removePending,
  utils_Delete_Account,
} from "@/utils/account-utils";

const DashboardAdmin = () => {
  return (
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
};

export const AdminTable = ({ noAction }: { noAction?: boolean }) => {
  const [dataCol, setDataCol] = useState<ColumnsType<AdminData>>([
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
      render: (value) => (
        <div
          className={`grid ${
            value === `pending` ? `bg-yellow-500` : `bg-lime-500`
          } place-items-center rounded-xl w-[6em] py-1 text-white`}
        >
          {value}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => <RemoveAdmin record={record} />,
    },
  ]);
  const data = useUserContext().state.listOfAdmins;
  const dataColRef = useRef(dataCol);
  useEffect(() => {
    if (noAction) {
      const oldDataCol = [...dataColRef.current];
      const newDataCol = oldDataCol.filter((item) => item.key !== "action");
      setDataCol(newDataCol);
    }
  }, [noAction]);

  return <Table columns={dataCol} dataSource={data} scroll={{ x: 50 }} />;
};

const RemoveAdmin = ({ record }: { record: AdminData }) => {
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const userCtxState = useUserContext();
  const userEmail = userCtxState.state.userDetails;

  const handleFinish = async () => {
    try {
      setLoading(true);
      await form.validateFields().catch(() => {
        throw new Error("Please fillup password");
      });
      const password = form.getFieldValue("password");
      const email = userEmail?.email;
      await signInWithEmailAndPassword(auth, email ?? "", password);
      if (record.status === "admin") {
        await firebase_admin_delete_user(record.email, userEmail?.uid ?? "");
        await utils_Delete_Account(record.key);
      } else if (record.status === "pending") {
        const token = await auth.currentUser?.getIdToken();
        await removePending(token, record.key);
      }
      setOpen(false);
    } catch (e) {
      console.error(e);
      message.error((e as Error).message);
    } finally {
      form.resetFields();
      setLoading(false);
    }
  };

  const handleClick = () => {
    setOpen(true);
  };
  return (
    <>
      <PriButton onClick={handleClick} className="bg-[red] hover:bg-[red]/80">
        Remove Access
      </PriButton>
      <Modal
        okButtonProps={{
          className: "bg-red-600",
          onClick: handleFinish,
          loading: loading,
        }}
        onCancel={() => setOpen(false)}
        okText={"Confirm"}
        title="Warning"
        open={open}
        destroyOnClose
      >
        <Form form={form}>
          <div className="opacity-80">
            You are about to remove someone&apos;s admin access
          </div>
          <ul className="list-disc list-inside">
            <li>{record.email}</li>
          </ul>
          <Form.Item
            rules={[{ required: true, message: "Please input your Username!" }]}
            required
            name={"password"}
          >
            <Password
              className="mt-5"
              onChange={(e) => {}}
              placeholder="type your password"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DashboardAdmin;
