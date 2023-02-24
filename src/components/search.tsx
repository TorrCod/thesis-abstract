import { Input } from "antd";
import React from "react";
import { BsSearch } from "react-icons/bs";

const Search = () => {
  return <Input prefix={<BsSearch color="grey" />} placeholder="Search" />;
};

export default Search;
