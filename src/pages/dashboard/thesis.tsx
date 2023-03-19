import { PriButton } from "@/components/button";
import DashboardLayout from "@/components/dashboardLayout";
import QuerySearch from "@/components/QuerySearch";
import useGlobalContext from "@/context/globalContext";
import { Course, ThesisItems } from "@/context/types.d";
import useUserContext from "@/context/userContext";
import { tableData } from "@/data/dummydata";
import { removeThesisITems, thesisToDataType } from "@/utils/helper";
import { Button, Card, Divider, Menu, message, Statistic, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { MenuProps } from "rc-menu";
import React, { useEffect, useState } from "react";
import { AiFillDelete, AiFillFileAdd } from "react-icons/ai";
import { BsBookFill } from "react-icons/bs";
import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { ResponsiveContainer } from "recharts";

const DashboardThesis = () => {
  const totalData: { course: Course; count: number }[] = [
    { course: "Civil Engineer", count: 320 },
    { course: "Computer Engineer", count: 230 },
    { course: "Mechanical Engineer", count: 300 },
    { course: "Electronics Engineer", count: 257 },
    { course: "Electrical Engineer", count: 314 },
  ];
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/thesis"
    >
      <div className="m-auto relative">
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
          <div className="grid md:grid-cols-2 gap-2 grid-rows-6 md:grid-rows-3">
            {totalData.map((child, index) => (
              <Card
                className="cursor-pointer hover:scale-105 transition duration-200 ease-out"
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
          <QuerySearch onSearch={() => {}} />
          <ThesisTable />
        </div>
      </div>
    </DashboardLayout>
  );
};
type DataType = {
  key: string;
  title: string;
  course: Course;
  [key: string]: any;
};

export const ThesisTable = () => {
  const { state } = useGlobalContext();
  const [thesisTableData, setThesisTableData] = useState<DataType[]>([]);
  const [removedTableData, setRemovedTableData] = useState<DataType[]>([]);
  const [selectedKeys, setSelectedKeys] = useState("thesis-items");

  useEffect(() => {
    const thesisItems = state.thesisItems;
    const toTableThesisItems = thesisToDataType(thesisItems);
    console.log(toTableThesisItems);
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
      dataIndex: "expirteAt",
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
        }}
        mode="horizontal"
        items={menuItems}
        defaultSelectedKeys={["thesis-items"]}
      />
      {selectedKeys === "thesis-items" && (
        <Table
          className="min-w-[40em]"
          columns={thesisTableColumn}
          dataSource={thesisTableData}
        />
      )}
      {selectedKeys === "recyclebin" && (
        <Table
          className="min-w-[40em]"
          columns={removeTableColumn}
          dataSource={removedTableData}
        />
      )}
    </div>
  );
};

const RemoveThesis = (props: DataType & { id: string }) => {
  const thesisItems = useGlobalContext().state.thesisItems;
  const uid = useUserContext().state.userDetails?.uid;
  const handleClick = async () => {
    try {
      const thesisItem: ThesisItems = thesisItems.filter(
        (item) => item.id === props.id
      )[0];
      const itemRemoved = await removeThesisITems(uid ?? "", thesisItem);
      console.log(itemRemoved);
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
      // const itemRemoved = await removeThesisITems(props.id);
      console.log(props.id);
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
      icon={<AiFillDelete size={"1.5em"} color="red" />}
      type="ghost"
    >
      Remove
    </Button>
  );
};

export default DashboardThesis;
