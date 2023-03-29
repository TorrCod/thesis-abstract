import DashboardLayout from "@/components/dashboardLayout";
import QuerySearch from "@/components/QuerySearch";
import useGlobalContext from "@/context/globalContext";
import { Course } from "@/context/types.d";
import useUserContext from "@/context/userContext";
import { auth } from "@/lib/firebase";
import { thesisToDataType } from "@/utils/helper";
import {
  getAllThesis,
  removeThesis,
  restoreThesis,
} from "@/utils/thesis-item-utils";
import {
  Button,
  Card,
  Divider,
  Menu,
  message,
  Space,
  Statistic,
  Table,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { getCsrfToken } from "next-auth/react";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import { MenuProps } from "rc-menu";
import React, { useEffect, useState } from "react";
import { AiFillDelete, AiFillFileAdd } from "react-icons/ai";
import { BsBookFill } from "react-icons/bs";
import { MdRestoreFromTrash } from "react-icons/md";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Tooltip,
} from "recharts";
import { ResponsiveContainer } from "recharts";
import { authOptions } from "../api/auth/[...nextauth]";

const DashboardThesis = () => {
  const { state: globalStatate } = useGlobalContext();
  const router = useRouter();
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/thesis"
    >
      <div className="m-auto relative">
        <div className="opacity-80 mb-3">Dashboard {">"} Thesis</div>
        <div className="md:grid gap-2 lg:grid-cols-2 relative w-full">
          <div className="bg-white rounded-md shadow-md pt-7 mb-2 md:mb-0">
            <p className="ml-6 opacity-60">Total Thesis Abstracts</p>
            <Space className="ml-6" direction="horizontal">
              <BsBookFill size={"1.5em"} />
              <h1>{globalStatate.totalThesisCount.totalCount}</h1>
            </Space>
            <div className="h-96 w-full relative overflow-auto">
              <div className="h-full w-full min-w-[32em]">
                <ThesisCharts />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-2 grid-rows-6 md:grid-rows-3">
            {globalStatate.totalThesisCount.thesisCount.map((child, index) => (
              <Card
                className="cursor-pointer hover:scale-105 hover:z-10 transition duration-200 ease-out"
                key={index}
                bordered={false}
              >
                <Statistic
                  title={child.course}
                  prefix={<BsBookFill size={"0.9em"} />}
                  value={child.count}
                />
              </Card>
            ))}
            <Link
              href="/dashboard/thesis/upload-thesis"
              className="cursor-pointer relative"
            >
              <Card
                bordered={false}
                className="h-full  hover:scale-105 transition duration-200 ease-out"
              >
                <div className="opacity-[.50] text-sm ">
                  Add Thesis Abstracts
                </div>
                <AiFillFileAdd
                  className="m-auto absolute top-0 bottom-0 left-0 right-0"
                  size={"2em"}
                />
              </Card>
            </Link>
          </div>
        </div>
        <Divider />
        <div className="mt-5 bg-white grid gap-1 rounded-md p-5 overflow-auto">
          <p className="opacity-60 mb-5">Manage Thesis Abstracts</p>
          <QuerySearch
            onSearch={(query) => {
              router.push(`/dashboard/thesis${query ? `?title=${query}` : ``}`);
            }}
          />
          <ThesisTable />
        </div>
      </div>
    </DashboardLayout>
  );
};

export const ThesisCharts = () => {
  const { state: globalStatate, loadThesisCount } = useGlobalContext();
  useEffect(() => {
    loadThesisCount();
  }, []);

  return (
    <ResponsiveContainer width={"99%"} height="99%">
      <RadarChart
        outerRadius={90}
        data={globalStatate.totalThesisCount.thesisCount}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="course" />
        <Radar
          name="Thesis Count"
          dataKey="count"
          stroke="#F8B49C"
          fill="#F8B49C"
          fillOpacity={0.6}
        />
        <Tooltip />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

type DataType = {
  key: string;
  title: string;
  course: Course;
  [key: string]: any;
};

export const ThesisTable = () => {
  const userDetails = useUserContext().state.userDetails;
  const { state, recycledThesis, loadThesisItems, loadingState } =
    useGlobalContext();
  const [thesisTableData, setThesisTableData] = useState<DataType[]>([]);
  const [removedTableData, setRemovedTableData] = useState<DataType[]>([]);
  const [selectedKeys, setSelectedKeys] = useState("thesis-items");
  const router = useRouter();

  useEffect(() => {
    if (router.query.tab) {
      setRemovedTableData((oldState) => {
        return oldState.filter((item) => item.key === router.query.id);
      });
      setSelectedKeys(router.query.tab as string);
    } else if (router.query.title) {
      const title = router.query.title as string;
      getAllThesis({ title: title })
        .then(async (thesisItems) => {
          const tableData = thesisToDataType(thesisItems);
          setThesisTableData(tableData);
        })
        .finally(() => loadingState.remove("all-thesis"));
    } else {
      if (userDetails) {
        const recycled = recycledThesis();
        recycled.load();
        loadThesisItems();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, userDetails]);

  useEffect(() => {
    const thesisItems = state.thesisItems;
    const toTableThesisItems = thesisToDataType(thesisItems);
    setThesisTableData(toTableThesisItems);
    const recycleItems = state.recyclebin;
    const toTableRecycle = thesisToDataType(recycleItems);
    setRemovedTableData(toTableRecycle);
  }, [state.thesisItems, state.recyclebin]);

  const menuItems: MenuProps["items"] = [
    { key: "thesis-items", label: "Thesis Items" },
    { key: "recyclebin", label: "Recycle Bin" },
  ];

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
      title: "Course",
      dataIndex: "course",
      key: "course",
    },
  ];

  const thesisTableColumn: ColumnsType<DataType> = [
    ...tableColumn,
    {
      title: "Date Added",
      dataIndex: "dateAdded",
      key: "dateAdded",
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (_, record) => <RemoveThesis {...record} id={record.key} />,
    },
  ];

  const removeTableColumn: ColumnsType<DataType> = [
    ...tableColumn,
    {
      title: "Expire At",
      key: "expireAt",
      dataIndex: "expireAt",
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (_, record) => <RestoreThesis {...record} id={record.key} />,
    },
  ];

  return (
    <div className="min-h-[20em]">
      <Menu
        onSelect={(item) => {
          setSelectedKeys(item.key);
          router.push("/dashboard/thesis");
        }}
        mode="horizontal"
        items={menuItems}
        defaultSelectedKeys={[(router.query.tab as string) ?? "thesis-items"]}
      />
      {selectedKeys === "thesis-items" && (
        <Table
          loading={state.loading.includes("all-thesis")}
          className="min-w-[40em]"
          columns={thesisTableColumn}
          dataSource={thesisTableData}
        />
      )}
      {selectedKeys === "recyclebin" && (
        <Table
          className="min-w-[40em]"
          columns={removeTableColumn.map((item) => {
            if (item.key === "title") item.render = undefined;
            return item;
          })}
          dataSource={removedTableData}
        />
      )}
    </div>
  );
};

const RemoveThesis = (props: DataType & { id: string }) => {
  const handleClick = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      await removeThesis({ token: token, thesisId: props.id });
      message.success("Removed Success");
    } catch (e) {
      message.error("remove failed");
      console.error(e);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="flex justify-center gap-1"
      icon={<AiFillDelete size={"1.5em"} color="red" />}
      type="ghost"
    >
      Remove
    </Button>
  );
};

const RestoreThesis = (props: DataType & { id: string }) => {
  const handleClick = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      await restoreThesis({ token: token, thesisId: props.id });
      message.success("Restore Success");
    } catch (e) {
      message.error("Restore failed");
      console.error(e);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="flex justify-center gap-1"
      icon={<MdRestoreFromTrash size={"1.5em"} color="green" />}
      type="ghost"
    >
      Restore
    </Button>
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

export default DashboardThesis;
