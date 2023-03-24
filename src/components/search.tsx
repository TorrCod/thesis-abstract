import {
  Checkbox,
  Dropdown,
  Form,
  Input,
  InputRef,
  Menu,
  MenuProps,
  Space,
} from "antd";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { PriButton } from "./button";
import { DownOutlined } from "@ant-design/icons";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import {
  SearchAction,
  SearchProps,
  SearchState,
  searchState_init,
} from "./types.d";
import Link from "next/link";
import { Course } from "@/context/types.d";
import useGlobalContext from "@/context/globalContext";
import { getAllThesis } from "@/utils/thesis-item-utils";

const courseOption = [
  "Computer Engineer",
  "Mechanical Engineer",
  "Electrical Engineer",
  "Civil Engineer",
];

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
    case "onchange": {
      const newState = { ...state };
      newState["searchTitle"] = action.payload;
      return newState;
    }
  }
};

const Search = ({ className, limit }: SearchProps) => {
  const searchRef: React.Ref<InputRef> | undefined = useRef(null);
  const [searchState, searchDispatch] = useReducer(
    searchReducer,
    searchState_init
  );
  const globalCtx = useGlobalContext();

  useEffect(() => {
    searchDispatch({
      type: "populate-option",
      payload: { course: courseOption, date: globalCtx.state.dateOption },
    });
  }, [globalCtx.state.dateOption]);

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
    searchRef.current?.blur();
    const searchTitle = searchState.searchTitle;
    const filterCourse: Course[] = searchState.checkBox.course.option as any;
    const filterDate = searchState.checkBox.date.option;
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
    const isCheckAll = valueType.length === globalCtx.state.dateOption.length;
    const item = valueType as string[];
    console.log(valueType);

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
        option: isChecked ? globalCtx.state.dateOption : [],
      },
    });
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    searchDispatch({ type: "onchange", payload: e.target.value });
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
        options={globalCtx.state.dateOption}
        value={searchState.checkBox.date.option}
        onChange={handleCheckBxDate}
      />
    </div>
  );

  return (
    <div
      className={
        "p-2 bg-slate-100 rounded-md grid shadow-md " +
        className +
        (searchState.searchFocus ? " gap-2" : " overflow-hidden max-h-12")
      }
      onFocus={() => searchDispatch({ type: "focus", payload: true })}
      onBlur={() => searchDispatch({ type: "focus", payload: false })}
      tabIndex={0}
    >
      <Form className="flex gap-2">
        <Input
          onChange={handleChange}
          ref={searchRef}
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
        className={`overflow-hidden relative ${
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
      <div
        className={`w-fulls rounded-md overflow-hidden relative ${
          searchState.searchFocus ? "" : "mt-5"
        }`}
      >
        <SearchItem {...searchState} limit={limit} />
      </div>
    </div>
  );
};

const SearchItem = (props: SearchState & { limit?: number }) => {
  const [menuItem, setMenuItem] = useState<MenuProps["items"]>([]);
  let searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    clearTimeout(searchTimeoutRef.current ?? 0);
    searchTimeoutRef.current = setTimeout(() => {
      if (props.searchTitle) {
        getAllThesis(
          {
            title: props.searchTitle,
          },
          {
            limit: props.limit ?? 10,
            projection: { _id: 1, title: 1 },
          }
        )
          .then((res) => {
            const myMenu: MenuProps["items"] = res.map((item) => {
              return {
                key: item._id!,
                label: item.title,
              };
            });
            if (myMenu.length >= (props.limit ?? 10)) {
              setMenuItem([
                ...myMenu,
                {
                  label: "view more ...",
                  key: "viewmore",
                  icon: <BsSearch color="#F8B49C" />,
                },
              ]);
            } else setMenuItem(myMenu as any);
          })
          .catch((e) => {
            console.error(e);
          });
      } else {
        setMenuItem([]);
      }
    }, 500);
    return () => clearTimeout(searchTimeoutRef.current ?? 0);
  }, [props.checkBox, props.searchTitle]);
  return <Menu items={menuItem} />;
};

export default Search;
