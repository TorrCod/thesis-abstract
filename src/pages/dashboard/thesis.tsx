import DashboardLayout from "@/components/dashboardLayout";
import QuerySearch from "@/components/QuerySearch";
import useGlobalContext from "@/context/globalContext";
import { Course } from "@/context/types.d";
import useUserContext from "@/context/userContext";
import { auth } from "@/lib/firebase";
import { thesisToDataType } from "@/utils/helper";
import { removeThesis, restoreThesis } from "@/utils/thesis-item-utils";
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
import { useRouter } from "next/router";
import { MenuProps } from "rc-menu";
import React, { ReactElement, useEffect, useRef, useState } from "react";
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
import useSocketContext from "@/context/socketContext";
import { NextPageWithLayout } from "../_app";

const menuItems: MenuProps["items"] = [
  { key: "thesis-items", label: "Thesis Items" },
  { key: "recyclebin", label: "Recycle Bin" },
];

const Page: NextPageWithLayout = () => {
  const { state: globalStatate, updateSearchTitle } = useGlobalContext();
  const router = useRouter();

  const handleMenu: MenuProps["onSelect"] = (item) => {
    router.push(`/dashboard/thesis?tab=${item.key}`);
  };

  const handleSearch = (searchText: string) => {
    if (searchText === "") updateSearchTitle(undefined);
    else updateSearchTitle(searchText);
  };
  return (
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
              <div className="opacity-[.50] text-sm ">Add Thesis Abstracts</div>
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
        <QuerySearch onSearch={handleSearch} />
        <div className="h-[50em]">
          <Menu
            onSelect={handleMenu}
            mode="horizontal"
            items={menuItems}
            defaultSelectedKeys={[
              (router.query.tab as string) ?? "thesis-items",
            ]}
          />

          {router.query.tab === "recyclebin" ? (
            <RecycledTable />
          ) : (
            <ThesisTable />
          )}
        </div>
      </div>
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Page;

export const ThesisCharts = () => {
  const { state: globalStatate, loadThesisCount } = useGlobalContext();
  useEffect(() => {
    if (!globalStatate.totalThesisCount.totalCount) {
      loadThesisCount();
    }
  }, [globalStatate.totalThesisCount.totalCount]);

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

export const ThesisTable = () => {
  const { state: userState } = useUserContext();
  const userDetails = userState.userDetails;
  const { state, loadThesisItems, updateSearchTitle } = useGlobalContext();
  const [thesisTableData, setThesisTableData] = useState<DataType[]>([]);

  useEffect(() => updateSearchTitle(undefined), []);

  useEffect(() => {
    if (userDetails) {
      loadThesisItems();
    }
  }, [userDetails, state.searchTitle]);

  useEffect(() => {
    const thesisItems = state.thesisItems;
    const toTableThesisItems = thesisToDataType(thesisItems);
    setThesisTableData(toTableThesisItems);
  }, [state.thesisItems]);

  return (
    <Table
      loading={state.loading.includes("all-thesis")}
      className="min-w-[40em]"
      columns={thesisTableColumn}
      dataSource={thesisTableData}
    />
  );
};

const RecycledTable = () => {
  const [removedTableData, setRemovedTableData] = useState<DataType[]>([]);
  const { state, loadRecycle, updateSearchTitle } = useGlobalContext();
  const { userDetails } = useUserContext().state;

  useEffect(() => updateSearchTitle(undefined), []);

  useEffect(() => {
    if (userDetails) {
      loadRecycle();
    }
  }, [userDetails, state.searchTitle]);

  useEffect(() => {
    const thesisItems = state.recyclebin;
    const toTableThesisItems = thesisToDataType(thesisItems);
    setRemovedTableData(toTableThesisItems);
  }, [state.recyclebin]);

  return (
    <Table
      className="min-w-[40em]"
      columns={removeTableColumn.map((item) => {
        if (item.key === "title") item.render = undefined;
        return item;
      })}
      dataSource={removedTableData}
    />
  );
};

const RemoveThesis = (props: DataType & { id: string }) => {
  const { removeThesisItem } = useGlobalContext();
  const { triggerSocket } = useSocketContext();

  const handleClick = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      await removeThesis({ token: token, thesisId: props.id });
      removeThesisItem(props.id);
      triggerSocket("thesis-update");
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
  const { restoreThesis: restore } = useGlobalContext();
  const { triggerSocket } = useSocketContext();
  const handleClick = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      await restoreThesis({ token: token, thesisId: props.id });
      restore(props.id);
      triggerSocket("thesis-update");
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

const removeTableColumn: ColumnsType<DataType> = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Course",
    dataIndex: "course",
    key: "course",
  },
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

type DataType = {
  key: string;
  title: string;
  course: Course;
  [key: string]: any;
};

const thesisTableColumn: ColumnsType<DataType> = [
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
