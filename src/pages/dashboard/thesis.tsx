import DashboardLayout from "@/components/dashboardLayout";
import QuerySearch from "@/components/QuerySearch";
import useGlobalContext from "@/context/globalContext";
import { Course } from "@/context/types.d";
import { auth } from "@/lib/firebase";
import { thesisToDataType } from "@/utils/helper";
import {
  getAllThesis,
  removeThesis,
  restoreThesis,
  getAllDeletedThesis,
} from "@/utils/thesis-item-utils";
import {
  Button,
  Card,
  Divider,
  Menu,
  message,
  Pagination,
  PaginationProps,
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
import { NextPageWithLayout } from "../_app";
import useUserContext from "@/context/userContext";
import { useEffectOnce } from "react-use";

const menuItems: MenuProps["items"] = [
  { key: "thesis-items", label: "Thesis Items" },
  { key: "recyclebin", label: "Recycle Bin" },
];

const Page: NextPageWithLayout = () => {
  const {
    state: globalState,
    updateSearchAction,
    loadThesisItems,
    loadingState,
    loadRecycle,
  } = useGlobalContext();
  const router = useRouter();

  const handleMenu: MenuProps["onSelect"] = (item) => {
    router.push(`/dashboard/thesis?tab=${item.key}`);
  };

  const handleSearch = (searchText: string) => {
    const searchAction = {
      ...globalState.searchingAction,
      searchTitle: searchText === "" ? undefined : searchText,
    };
    updateSearchAction().update(searchAction);
    if (router.query.tab === "thesis-items" || !router.query.tab) {
      loadingState.add("thesis-table");
      loadThesisItems(undefined, undefined, searchAction).finally(() =>
        loadingState.remove("thesis-table")
      );
    } else {
      loadingState.add("recycle-table");
      loadRecycle(undefined, undefined, searchAction).finally(() =>
        loadingState.remove("recycle-table")
      );
    }
  };

  return (
    <div className="m-auto relative w-full">
      <div className="opacity-80 mb-3">Dashboard {">"} Thesis</div>
      <div className="md:grid gap-2 lg:grid-cols-2 relative w-full">
        <div className="bg-white rounded-md shadow-md pt-7 mb-2 md:mb-0">
          <p className="ml-6 opacity-60">Total Thesis Abstracts</p>
          <Space className="ml-6" direction="horizontal">
            <BsBookFill size={"1.5em"} />
            <h1>{globalState.totalThesisCount.totalCount}</h1>
          </Space>
          <div className="h-96 w-full relative overflow-auto">
            <div className="h-full w-full min-w-[32em]">
              <ThesisCharts />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-2 grid-rows-6 md:grid-rows-3">
          {globalState.totalThesisCount.thesisCount.map((child, index) => (
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
      <div className="mt-5 bg-white gap-1 rounded-md p-5 relative w-full">
        <p className="opacity-60 mb-5">Manage Thesis Abstracts</p>
        <QuerySearch onSearch={handleSearch} />
        <Divider />
        <Menu
          onSelect={handleMenu}
          mode="horizontal"
          items={menuItems}
          defaultSelectedKeys={[(router.query.tab as string) ?? "thesis-items"]}
        />

        {router.query.tab === "recyclebin" ? (
          <RecycledTable />
        ) : (
          <ThesisTable />
        )}
      </div>
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Page;

export const ThesisCharts = () => {
  const { state: globalStatate } = useGlobalContext();

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
  const { state, updateSearchAction, loadThesisItems, dispatch } =
    useGlobalContext();
  const [thesisTableData, setThesisTableData] = useState<DataType[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollHandler = async (event: Event) => {
    const { scrollTop, scrollHeight, clientHeight } =
      event.target as HTMLDivElement;
    const isBottom = scrollHeight - scrollTop === clientHeight;

    if (
      isBottom &&
      !(state.thesisItems.document.length === state.thesisItems.totalCount)
    ) {
      console.log("hello");
      const newSearchAction = { ...state.searchingAction };
      newSearchAction.pageNo = (newSearchAction.pageNo ?? 1) + 1;

      const searchAction = newSearchAction;
      const { searchTitle: title } = searchAction;

      const thesisItems = await getAllThesis(
        {
          title,
        },
        {
          projection: {
            title: 1,
            course: 1,
            dateAdded: 1,
          },
        },
        searchAction.pageNo,
        searchAction.pageSize
      );
      if (thesisItems.document.length) {
        const newThesisITemsState = { ...state.thesisItems };
        newThesisITemsState.document = [
          ...newThesisITemsState.document,
          ...thesisItems.document,
        ];
        dispatch({ type: "load-thesis", payload: newThesisITemsState });
        updateSearchAction().update(newSearchAction);
      }
    }
  };

  useEffectOnce(() => updateSearchAction().clear());

  useEffect(() => {
    const thesisItems = state.thesisItems;
    const toTableThesisItems = thesisToDataType(thesisItems.document);
    setThesisTableData(toTableThesisItems);

    const layout_ref = document.getElementById(
      "layout-container"
    ) as HTMLDivElement;
    scrollRef.current = layout_ref;
    scrollRef.current.addEventListener("scroll", scrollHandler);
    return () => {
      scrollRef.current?.removeEventListener("scroll", scrollHandler);
    };
  }, [state.thesisItems]);

  return (
    <>
      <Table
        loading={state.loading.includes("thesis-table")}
        columns={thesisTableColumn}
        dataSource={thesisTableData}
        scroll={{ x: 50 }}
        pagination={false}
      />
    </>
  );
};

const RecycledTable = () => {
  const [removedTableData, setRemovedTableData] = useState<DataType[]>([]);
  const { state } = useGlobalContext();
  const { updateSearchAction, loadingState, loadRecycle, dispatch } =
    useGlobalContext();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => updateSearchAction().clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highlightRow = (record: any) => {
    // Add your logic to determine if the row should be highlighted here
    return record.key === router.query._id
      ? "bg-red-500/30 border-2 border-blue-200 rounded-md !important"
      : "";
  };

  const scrollHandler = async (event: Event) => {
    const { scrollTop, scrollHeight, clientHeight } =
      event.target as HTMLDivElement;
    const isBottom = scrollHeight - scrollTop === clientHeight;
    if (
      isBottom &&
      !(state.recyclebin.document.length === state.recyclebin.totalCount)
    ) {
      const newSearchAction = { ...state.searchingAction };
      newSearchAction.pageNo = (newSearchAction.pageNo ?? 1) + 1;

      const searchAction = newSearchAction;
      const { searchTitle: title } = searchAction;
      const token = await auth.currentUser?.getIdToken();
      const recyclebin = await getAllDeletedThesis(
        token,
        {
          title,
        },
        {
          projection: {
            title: 1,
            course: 1,
            createdAt: 1,
            expireAfterSeconds: 1,
          },
        },
        searchAction.pageNo,
        searchAction.pageSize
      );
      if (
        recyclebin.document.length &&
        !(state.recyclebin.document.length === state.recyclebin.totalCount)
      ) {
        const newRecycleState = { ...state.recyclebin };
        newRecycleState.document = [
          ...newRecycleState.document,
          ...recyclebin.document,
        ];
        dispatch({ type: "load-recycle", payload: newRecycleState });
        updateSearchAction().update(newSearchAction);
      }
    }
  };

  useEffect(() => {
    const thesisItems = state.recyclebin.document;
    const toTableThesisItems = thesisToDataType(thesisItems);
    setRemovedTableData(toTableThesisItems);

    const layout_ref = document.getElementById(
      "layout-container"
    ) as HTMLDivElement;
    scrollRef.current = layout_ref;
    scrollRef.current.addEventListener("scroll", scrollHandler);
    return () => {
      scrollRef.current?.removeEventListener("scroll", scrollHandler);
    };
  }, [state.recyclebin]);

  return (
    <>
      <Table
        loading={state.loading.includes("recycle-table")}
        className="min-w-[40em]"
        columns={removeTableColumn.map((item) => {
          if (item.key === "title") item.render = undefined;
          return item;
        })}
        dataSource={removedTableData}
        pagination={false}
        rowClassName={highlightRow}
      />
    </>
  );
};

const RemoveThesis = (props: DataType & { id: string }) => {
  const { removeThesisItem, loadingState, loadRecycle } = useGlobalContext();
  const { loadActivityLog } = useUserContext();

  const handleClick = async () => {
    try {
      loadingState.add("thesis-table");
      const token = await auth.currentUser?.getIdToken();
      removeThesisItem(props.id);
      loadingState.remove("thesis-table");
      await removeThesis({ token: token, thesisId: props.id });
      loadActivityLog();
      loadRecycle();
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
  const {
    restoreThesis: restore,
    loadingState,
    refreshThesis,
    loadThesisItems,
  } = useGlobalContext();
  const { loadActivityLog } = useUserContext();

  const handleClick = async () => {
    loadingState.add("recycle-table");
    restore(props.id);
    loadingState.remove("recycle-table");
    const token = await auth.currentUser?.getIdToken();
    await restoreThesis({ token: token, thesisId: props.id });
    loadThesisItems();
    loadActivityLog();
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
      <Link
        className="hover:underline hover:decoration-1 hover:text-blue-800"
        href={"/thesis/" + record.key}
      >
        {text}
      </Link>
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
