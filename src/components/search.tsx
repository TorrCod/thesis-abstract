import { Checkbox, Dropdown, Input, InputRef, MenuProps, Space } from "antd";
import React, { Ref, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { PriButton } from "./button";
import { DownOutlined } from "@ant-design/icons";

const items: MenuProps["items"] = [
  {
    label: <Checkbox defaultChecked>All</Checkbox>,
    key: "0",
  },
  {
    label: <Checkbox>Computer Engineer</Checkbox>,
    key: "1",
  },
  {
    label: <Checkbox>Mechanical Engineer</Checkbox>,
    key: "2",
  },
  {
    label: <Checkbox>Electrical Engineer</Checkbox>,
    key: "3",
  },
  {
    label: <Checkbox>Civil Engineer</Checkbox>,
    key: "4",
  },
];

const itemDate: MenuProps["items"] = [
  {
    label: <Checkbox defaultChecked>All</Checkbox>,
    key: "0",
  },
  {
    label: <Checkbox>2020</Checkbox>,
    key: "1",
  },
  {
    label: <Checkbox>2021</Checkbox>,
    key: "2",
  },
];

const Search = ({ className }: { className?: string }) => {
  const [active, setActive] = useState(false);
  const [course, setCourse] = useState(false);
  const [date, setDate] = useState(false);
  const inputRef = useRef<any>(null);

  const handleOpenCourse = (flag: boolean) => {
    setCourse(flag);
  };

  const handleOpenDate = (flag: boolean) => {
    setDate(flag);
  };

  const handleSearch = () => {
    setActive(false);
    inputRef.current?.blur();
  };

  return (
    <div
      className={
        "p-2 bg-slate-100 rounded-md grid transition-all ease-in-out duration-300 " +
        className +
        (active ? " gap-2" : " gap-0")
      }
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={0}
    >
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          onPressEnter={handleSearch}
          prefix={<BsSearch color="#38649C" />}
          placeholder="Search"
        />
        <PriButton onClick={handleSearch}>
          <BsSearch color="white" />
        </PriButton>
      </div>
      <div
        className={`transition-all ease-in-out duration-300 overflow-hidden relative ${
          active ? "max-h-28" : "max-h-0"
        }`}
      >
        <Space>
          <Dropdown
            open={course}
            onOpenChange={handleOpenCourse}
            menu={{ items }}
            trigger={["click"]}
          >
            <a
              className="cursor-pointer text-slate-900"
              onClick={(e) => e.preventDefault()}
            >
              <Space>
                Course
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
          <Dropdown
            open={date}
            onOpenChange={handleOpenDate}
            menu={{ items: itemDate }}
            trigger={["click"]}
          >
            <a
              className="cursor-pointer text-slate-900"
              onClick={(e) => e.preventDefault()}
            >
              <Space>
                Date
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};

export default Search;
