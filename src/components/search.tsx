import { Checkbox, Dropdown, Form, Input, Space } from "antd";
import React, { useEffect, useReducer, useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { PriButton } from "./button";
import { DownOutlined } from "@ant-design/icons";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { SearchAction, SearchState, searchState_init } from "./types.d";
import Link from "next/link";

const courseOption = [
  "Computer Engineer",
  "Mechanical Engineer",
  "Electrical Engineer",
  "Civil Engineer",
];

const dateOption = ["2020", "2021", "2022"];

const searchReducer: (
  state: SearchState,
  action: SearchAction
) => SearchState = (state, action) => {
  switch (action.type) {
    case "focus":
      return { ...state, searchFocus: action.payload };
    case "dropdown":
      return { ...state, dropDownState: action.payload };
    case "populate-option": {
      const newState = { ...state };
      newState["checkBox"]["course"]["option"] = action.payload["course"];
      newState["checkBox"]["date"]["option"] = action.payload["date"];
      return newState;
    }
    case "oncheck-all": {
      const newState = { ...state };
      newState["checkBox"][action.payload.type]["all"] = action.payload.all;
      newState["checkBox"][action.payload.type]["option"] =
        action.payload.option;
      return newState;
    }
  }
};

const Search = ({ className }: { className?: string }) => {
  const inputRef = useRef<any>(null);
  const [searchState, searchDispatch] = useReducer(
    searchReducer,
    searchState_init
  );
  useEffect(() => {
    searchDispatch({
      type: "populate-option",
      payload: { course: courseOption, date: dateOption },
    });
    return () => {};
  }, []);

  const handleOpenCourse = (flag: boolean) => {
    searchDispatch({
      type: "dropdown",
      payload: { ...searchState.dropDownState, course: flag },
    });
  };

  const handleOpenDate = (flag: boolean) => {
    searchDispatch({
      type: "dropdown",
      payload: { ...searchState.dropDownState, date: flag },
    });
  };

  const handleSearch = () => {
    searchDispatch({ type: "focus", payload: false });
    inputRef.current?.blur();
  };

  const handleCheckBxCourse = (valueType: CheckboxValueType[]) => {
    const isCheckAll = valueType.length === courseOption.length;
    const item = valueType as string[];
    searchDispatch({
      type: "oncheck-all",
      payload: { type: "course", option: item, all: isCheckAll },
    });
  };

  const handleCheckBxDate = (valueType: CheckboxValueType[]) => {
    const isCheckAll = valueType.length === dateOption.length;
    const item = valueType as string[];
    searchDispatch({
      type: "oncheck-all",
      payload: { type: "date", option: item, all: isCheckAll },
    });
  };

  const handleCheckBxAllCourse = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    searchDispatch({
      type: "oncheck-all",
      payload: {
        type: "course",
        all: isChecked,
        option: isChecked ? courseOption : [],
      },
    });
  };

  const handleCheckBxAllDate = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    searchDispatch({
      type: "oncheck-all",
      payload: {
        type: "date",
        all: isChecked,
        option: isChecked ? dateOption : [],
      },
    });
  };

  const dropdownContentCourse = () => (
    <div className="bg-white p-2 shadow-lg relative rounded-md">
      <Checkbox
        checked={searchState.checkBox.course.all}
        onChange={handleCheckBxAllCourse}
      >
        All
      </Checkbox>
      <Checkbox.Group
        options={courseOption}
        value={searchState.checkBox.course.option}
        onChange={handleCheckBxCourse}
      />
    </div>
  );

  const dropdownContentDate = () => (
    <div className="bg-white p-2 shadow-lg relative rounded-md">
      <Checkbox
        checked={searchState.checkBox.date.all}
        onChange={handleCheckBxAllDate}
      >
        All
      </Checkbox>
      <Checkbox.Group
        options={dateOption}
        value={searchState.checkBox.date.option}
        onChange={handleCheckBxDate}
      />
    </div>
  );

  return (
    <div
      className={
        "p-2 bg-slate-100 rounded-md grid transition-all ease-in-out duration-300 " +
        className +
        (searchState.searchFocus ? " gap-2" : " gap-0")
      }
      onFocus={() => searchDispatch({ type: "focus", payload: true })}
      onBlur={() => searchDispatch({ type: "focus", payload: false })}
      tabIndex={0}
    >
      <Form className="flex gap-2">
        <Input
          ref={inputRef}
          prefix={<BsSearch color="#38649C" />}
          placeholder="Search"
        />

        <Link href={"/thesis"}>
          <PriButton htmlType="submit" onClick={handleSearch}>
            <BsSearch color="white" />
          </PriButton>
        </Link>
      </Form>
      <div
        className={`transition-all ease-in-out duration-300 overflow-hidden relative ${
          searchState.searchFocus ? "max-h-28" : "max-h-0"
        }`}
      >
        <Space>
          <Dropdown
            open={searchState.dropDownState.course}
            onOpenChange={handleOpenCourse}
            dropdownRender={dropdownContentCourse}
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
            open={searchState.dropDownState.date}
            onOpenChange={handleOpenDate}
            dropdownRender={dropdownContentDate}
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
