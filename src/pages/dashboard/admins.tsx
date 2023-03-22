import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  TimelineProps,
} from "antd";
import DashboardLayout from "@/components/dashboardLayout";
import QuerySearch from "@/components/QuerySearch";
import { PriButton } from "@/components/button";
import AdminProfile, { AddAdmin } from "@/components/admin";
import useUserContext from "@/context/userContext";
import { AdminData, PendingAdminList, UserDetails } from "@/context/types.d";
import { ColumnsType } from "antd/lib/table";
import Password from "antd/lib/input/Password";
import { useForm } from "antd/lib/form/Form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  deleteAdmin,
  findUser,
  firebase_admin_delete_user,
  getUserActivitylog,
  getUserDetails,
  removePending,
} from "@/utils/account-utils";
import { useRouter } from "next/router";
import Link from "next/link";
import { ActivityTimeline } from "./activitylog";

const DashboardAdmin = () => {
  const router = useRouter();
  const allUsers = useUserContext().state.listOfAdmins;
  const [userDetails, setUserDetails] = useState<any>();
  useEffect(() => {
    const isExist = allUsers.filter((item) => item.key === router.query._id);
    if (isExist[0] && allUsers[0]) {
      setUserDetails(isExist[0]);
    } else {
      setUserDetails(undefined);
    }
  }, [router.query._id, allUsers]);
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/admins"
    >
      <div className="opacity-80 mb-3">
        Dashboard {">"} <Link href={"/dashboard/admins"}>Admin</Link>{" "}
        {userDetails ? (
          <>
            {">"} {userDetails.userName ?? userDetails._id}
          </>
        ) : null}
      </div>
      {userDetails ? (
        <UserProfile userDetails={userDetails} />
      ) : (
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
      )}
    </DashboardLayout>
  );
};

const UserProfile = ({ userDetails }: { userDetails: UserDetails }) => {
  return (
    <div className="grid gap-2">
      <div className="bg-white rounded-md w-full p-3 relative grid gap-5">
        <div className="opacity-70">Profile</div>
        <div className="w-fit m-auto">
          <AdminProfile
            userDetails={userDetails}
            size={{ height: "7em", width: "7em" }}
          />
        </div>
        {(userDetails as any).status === "Pending" ? (
          <>
            <div className="text-center">
              <div>{userDetails.email}</div>
              <div className="text-sm bg-yellow-500 w-fit m-auto text-white px-2 rounded-md">
                {(userDetails as any).status}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-80 ">Invited By</div>
              {(userDetails as any).approove}
            </div>
            <div>
              <div className="text-sm opacity-80 ">Date Invited</div>
              {new Date(userDetails.dateAdded as string).toLocaleString()}
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div>
                {userDetails.firstName} {userDetails.lastName}
              </div>
              <div className="text-sm bg-lime-500 w-fit m-auto text-white px-2 rounded-md">
                {(userDetails as any).status as string}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-80 ">Email</div>
              {(userDetails as any).email}
            </div>
            <div>
              <div className="text-sm opacity-80 ">Username</div>
              {(userDetails as any).userName}
            </div>
            <div>
              <div className="text-sm opacity-80 ">Course</div>
              {(userDetails as any).course}
            </div>
            <div>
              <div className="text-sm opacity-80 ">Invited By</div>
              {userDetails.approove ?? "---"}
            </div>
            <div>
              <div className="text-sm opacity-80 ">Date</div>
              {new Date(userDetails.dateAdded as string).toLocaleString()}
            </div>
          </>
        )}
      </div>
      <div className="bg-white rounded-md p-3">
        <div className="opacity-80 mb-5">History</div>
        <ActivityTimeline username={userDetails.userName ?? "none"} />
      </div>
    </div>
  );
};

export const AdminTable = ({ noAction }: { noAction?: boolean }) => {
  const useDetails = useUserContext().state.userDetails;
  const [dataCol, setDataCol] = useState<ColumnsType<AdminData>>([
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      render: (val, record) => {
        const userId = useDetails?._id;
        const isUser = Object.values(record).includes(userId);
        return (
          <Link href={`/dashboard/admins?_id=${record.key}`}>
            {val ? (
              <Space direction="horizontal">
                <div>{val}</div>
                {isUser && (
                  <div className="bg-[#38649C] text-white px-3 rounded-md text-center">
                    you
                  </div>
                )}
              </Space>
            ) : (
              <div>------</div>
            )}
          </Link>
        );
      },
    },
    {
      title: "Date Added",
      dataIndex: "dateAdded",
      key: "dateAdded",
      render: (val, record) => {
        const dateAdded = new Date(val as string);
        const localString = dateAdded.toLocaleString();
        return localString;
      },
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
      render: (val) => {
        return val ?? "-------";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value, record) => {
        // Set the date the item was added
        const addedDate = new Date(record.dateAdded);

        // Calculate the expiration date
        const expirationDate = new Date(
          addedDate.getTime() + 7 * 24 * 60 * 60 * 1000
        );

        // Calculate the remaining days
        const remainingDays = Math.ceil(
          (expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        return (
          <>
            <div
              className={`grid ${
                value === `Pending` ? `bg-yellow-500` : `bg-lime-500`
              } place-items-center rounded-xl w-[6em] py-1 text-white`}
            >
              {value}
            </div>
            {value === "Pending" && (
              <div className="text-sm">Expire in {remainingDays} days</div>
            )}
          </>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => <RemoveAdmin record={record} />,
    },
  ]);
  const { state, loadAllUsers, dispatch } = useUserContext();
  const dataColRef = useRef(dataCol);
  useEffect(() => {
    loadAllUsers();
  }, []);

  useEffect(() => {
    if (noAction) {
      const oldDataCol = [...dataColRef.current];
      const newDataCol = oldDataCol.filter((item) => item.key !== "action");
      setDataCol(newDataCol);
    }
  }, [noAction]);

  return (
    <Table
      columns={dataCol}
      dataSource={state.listOfAdmins}
      scroll={{ x: 50 }}
    />
  );
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
      if (record.status === "Admin") {
        const token = await auth.currentUser?.getIdToken();
        await firebase_admin_delete_user(token, record.email);
        await deleteAdmin(token, record.key);
      } else if (record.status === "Pending") {
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
