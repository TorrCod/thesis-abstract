import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  Form,
  message,
  Modal,
  Space,
  Table,
  Timeline,
  TimelineProps,
} from "antd";
import DashboardLayout from "@/components/dashboardLayout";
import QuerySearch from "@/components/QuerySearch";
import { PriButton } from "@/components/button";
import AdminProfile, { AddAdmin } from "@/components/admin";
import useUserContext from "@/context/userContext";
import { ActivityLog, AdminData, UserDetails } from "@/context/types.d";
import { ColumnsType } from "antd/lib/table";
import Password from "antd/lib/input/Password";
import { useForm } from "antd/lib/form/Form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  customUpdateActivityLog,
  deleteAdmin,
  firebase_admin_delete_user,
  getActivityLog,
  removePending,
} from "@/utils/account-utils";
import { useRouter } from "next/router";
import Link from "next/link";
import Fuse from "fuse.js";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { getCsrfToken } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import useGlobalContext from "@/context/globalContext";
import { readActivityLogReason } from "@/utils/helper";
import useSocketContext from "@/context/socketContext";
import { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const allUsers = useUserContext().state.listOfAdmins;
  const [userDetails, setUserDetails] = useState<UserDetails | undefined>();
  useEffect(() => {
    const isExist = allUsers.filter((item) => item.key === router.query._id);
    if (isExist[0]) {
      setUserDetails(isExist[0] as UserDetails);
    } else {
      setUserDetails(undefined);
    }
  }, [router.query._id, allUsers]);

  return (
    <>
      <div className="opacity-80 mb-3">
        Dashboard {">"} <Link href={"/dashboard/admins"}>Admin</Link>
        {userDetails ? (
          <>
            {">"} {userDetails.userName ?? userDetails._id}
          </>
        ) : null}
      </div>
      {userDetails ? (
        <UserProfile userDetails={userDetails} />
      ) : (
        <div className="bg-white rounded-md p-5 flex flex-col gap-2 md:min-h-[85vh]">
          <p className="opacity-60 mb-5">Manage Co-Admins</p>
          <AddAdmin />
          <QuerySearch
            onSearch={(e) => {
              router.push(`/dashboard/admins${e ? `?username=${e}` : ``}`);
            }}
          />
          <AdminTable />
        </div>
      )}
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Page;

const UserProfile = ({ userDetails }: { userDetails: UserDetails }) => {
  const [history, setHistory] = useState<TimelineProps["items"]>([]);
  const user = useUserContext().state.userDetails;
  useEffect(() => {
    const fetchData = async () => {
      const token = await auth.currentUser?.getIdToken();
      getActivityLog(token, { userId: userDetails?.uid }, { limit: 7 })
        .then((res: ActivityLog[]) => {
          const data = res.map((item) => {
            const readedData = readActivityLogReason(item);
            return {
              label: new Date(item.date).toLocaleString(),
              children: <div>{readedData?.reason}</div>,
              dot: readedData?.dot,
              color: readedData?.color,
            };
          });
          setHistory(data);
        })
        .catch((e) => {
          console.error(e);
        });
    };
    if (user) {
      fetchData();
    }
  }, [user, userDetails]);

  return !userDetails ? (
    <></>
  ) : (
    <div className="grid gap-2 max-w-5xl m-auto lg:grid-cols-[1.2fr_0.8fr] auto-rows-auto">
      <div className="bg-white rounded-md w-full p-3 relative grid gap-5 min-h-[28em]">
        <div className="opacity-70">Profile</div>
        <div className="w-fit m-auto">
          <AdminProfile
            userDetails={userDetails}
            size={{ height: "7em", width: "7em" }}
          />
        </div>
        {userDetails?.status === "Pending" ? (
          <>
            <div className="text-center">
              <div>{userDetails.email}</div>
              <div className="text-sm bg-yellow-500 w-fit m-auto text-white px-2 rounded-md">
                {userDetails.status}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-80 ">Invited By</div>
              {userDetails.approove}
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
                {userDetails?.firstName} {userDetails?.lastName}
              </div>
              <div className="text-sm bg-lime-500 w-fit m-auto text-white px-2 rounded-md">
                {userDetails.status}
              </div>
            </div>

            <div className="grid gap-5 min-[400px]:grid-cols-2">
              <div>
                <div className="text-sm opacity-80 ">Email</div>
                {userDetails.email}
              </div>
              <div>
                <div className="text-sm opacity-80 ">Username</div>
                {userDetails.userName}
              </div>
              <div>
                <div className="text-sm opacity-80 ">Course</div>
                {userDetails.course}
              </div>
              <div>
                <div className="text-sm opacity-80 ">Invited By</div>
                {userDetails?.approove ?? "---"}
              </div>
              <div>
                <div className="text-sm opacity-80 ">Date joined</div>
                {new Date(userDetails?.dateAdded as string).toLocaleString()}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="bg-white rounded-md p-3 row-span-2 grid relative gap-5 grid-rows-[_0.2fr_1.8fr]">
        <div className="opacity-80">History</div>
        <div className="w-full">
          <Timeline mode="left" reverse items={history} />;
        </div>
      </div>
    </div>
  );
};

export const AdminTable = ({ noAction }: { noAction?: boolean }) => {
  const { state, loadAllUsers } = useUserContext();
  const { state: globalState } = useGlobalContext();
  const [dataCol, setDataCol] = useState<ColumnsType<AdminData>>(
    dataColumnType(state.userDetails)
  );
  const [dataSourse, setDataSourse] = useState<AdminData[]>([]);
  const dataColRef = useRef(dataCol);
  const router = useRouter();
  useEffect(() => {
    if (noAction) {
      const oldDataCol = [...dataColRef.current];
      const newDataCol = oldDataCol.filter((item) => item.key !== "action");
      setDataCol(newDataCol);
    }
  }, [noAction]);

  useEffect(() => {
    if (state.userDetails) {
      loadAllUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.userDetails]);

  useEffect(() => {
    if (router.query.username) {
      const searchTerm = router.query.username as string;
      const fuse = new Fuse<AdminData>(state.listOfAdmins, {
        keys: ["userName", "email"],
      });
      const source: AdminData[] = fuse
        .search(searchTerm)
        .map((item) => item.item);
      setDataSourse(source);
    } else {
      setDataSourse(state.listOfAdmins);
    }
  }, [router.query, state.listOfAdmins]);

  return (
    <Table
      loading={globalState.loading.includes("all-admin")}
      columns={dataCol}
      dataSource={dataSourse}
      scroll={{ x: 50 }}
    />
  );
};

const RemoveAdmin = ({ record }: { record: AdminData }) => {
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { state, loadAllUsers } = useUserContext();
  const userEmail = state.userDetails;
  const { triggerSocket } = useSocketContext();

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
        await customUpdateActivityLog(token, {
          reason: "removed an admin",
          itemId: record.key,
          date: new Date(),
          name: record.email,
        });
      } else if (record.status === "Pending") {
        const token = await auth.currentUser?.getIdToken();
        await removePending(token, record.key);
        await customUpdateActivityLog(token, {
          reason: "removed an invite",
          itemId: record.key,
          date: new Date(),
          name: record.email,
        });
      }
      triggerSocket("account-update");
      loadAllUsers();
      message.success("Remove Success");
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  const csrfToken = await getCsrfToken({ req });
  if (!session)
    return {
      redirect: { destination: "/?sign-in" },
      props: { data: [] },
    };
  if (!csrfToken) return { notFound: true };
  return {
    props: {
      data: [],
    },
  };
};

const dataColumnType = (userDetails: UserDetails | undefined) => {
  const tableColumn: ColumnsType<AdminData> = [
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      render: (val, record) => {
        const userId = userDetails?._id;
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
  ];
  return tableColumn;
};
