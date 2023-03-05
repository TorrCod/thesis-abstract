import React from "react";
import { Table } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date"
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "Course",
    dataIndex: "course",
    key: "course"
  },
  {
    title: "Action",
    key: "action",
    render: () => <a>Edit</a>
  }
];

const data = [
  {
    key: "1",
    name: "John Doe",
    date: "2022-02-01",
    email: "johndoe@example.com",
    course: "Computer Engineering"
  },
  {
    key: "2",
    name: "Jane Doe",
    date: "2022-02-02",
    email: "janedoe@example.com",
    course: "Mechanical Engineering"
  },
  {
    key: "3",
    name: "Bob Smith",
    date: "2022-02-03",
    email: "bobsmith@example.com",
    course: "Civil Engineering"
  }
];

const UsersTable = () => (
  <Table columns={columns} dataSource={data} />
);

export default UsersTable;
