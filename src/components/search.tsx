import {
  Checkbox,
  Col,
  Dropdown,
  Form,
  Input,
  Menu,
  MenuProps,
  Row,
  Space,
} from "antd";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { PriButton } from "./button";
import { DownOutlined } from "@ant-design/icons";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import {
  courseOption,
  SearchAction,
  SearchProps,
  SearchState,
  searchState_init,
} from "./types.d";
import Link from "next/link";
import { Course } from "@/context/types.d";
import useGlobalContext from "@/context/globalContext";
import { getAllThesis } from "@/utils/thesis-item-utils";
import { useClickAway } from "react-use";

const searchReducer: (
  state: SearchState,
  action: SearchAction
) => SearchState = (state, action) => {
  switch (action.type) {
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
    case "onfocus":
      return { ...state, focus: action.payload };
  }
};

const Search = ({ className, limit, onSearch }: SearchProps) => {
  const [searchState, searchDispatch] = useReducer(
    searchReducer,
    searchState_init
  );
  const globalCtx = useGlobalContext();
  const { course: courseOpt, years: yearsOpt } = globalCtx.state.filterState;
  const searchRef = useRef<HTMLDivElement>(null);
  const onSearchRef = useRef<HTMLAnchorElement>(null);
  useClickAway(searchRef, () => {
    searchDispatch({ type: "onfocus", payload: false });
  });

  const handleSearch = () => {
    const title = searchState.searchTitle;
    const course: Course[] = courseOpt.option as any;
    const year = yearsOpt.option;
    onSearch?.({ title, course, year });
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    searchDispatch({ type: "onchange", payload: e.target.value });
  };

  const handleShowMore = () => {
    onSearchRef.current?.click();
  };

  return (
    <div
      id="search-component"
      ref={searchRef}
      onFocus={() => searchDispatch({ type: "onfocus", payload: true })}
      className={"p-2 bg-slate-100 rounded-md grid shadow-md " + className}
    >
      <Form className="flex gap-2">
        <Input
          onChange={handleChange}
          prefix={<BsSearch color="#38649C" />}
          placeholder="Search"
        />
        <Link
          ref={onSearchRef}
          href={`/thesis?${
            searchState.searchTitle ? `title=${searchState.searchTitle}` : ``
          }${
            courseOpt.all
              ? ``
              : `&course=${encodeURIComponent(
                  JSON.stringify(courseOpt.option)
                )}`
          }${
            yearsOpt.all
              ? ``
              : `&year=${encodeURIComponent(JSON.stringify(yearsOpt.option))}`
          }`}
        >
          <PriButton htmlType="submit" onClick={handleSearch}>
            <BsSearch color="white" />
          </PriButton>
        </Link>
      </Form>
      <div>
        <Space>
          <DropDownCourse
            searchDispatch={searchDispatch}
            searchState={searchState}
          />
          <DropdownYear
            searchDispatch={searchDispatch}
            searchState={searchState}
          />
        </Space>
      </div>
      <div className={`w-fulls rounded-md overflow-hidden relative z-20`}>
        {searchState.focus && (
          <SearchItem
            {...searchState}
            limit={limit}
            onShowMore={handleShowMore}
          />
        )}
      </div>
    </div>
  );
};

const DropDownCourse = ({
  searchDispatch,
  searchState,
}: {
  searchDispatch: React.Dispatch<SearchAction>;
  searchState: SearchState;
}) => {
  const globalCtx = useGlobalContext();
  const { updateFilter } = globalCtx;
  const { course: courseOpt } = globalCtx.state.filterState;
  const handleCheckBxAllCourse = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    updateFilter({
      ...globalCtx.state.filterState,
      course: {
        all: isChecked,
        option: isChecked ? (courseOption as Course[]) : ["Computer Engineer"],
      },
    });
  };
  const handleCheckBxCourse = (valueType: CheckboxValueType[]) => {
    const isCheckAll = valueType.length === courseOption.length;
    const item = valueType as Course[];
    updateFilter({
      ...globalCtx.state.filterState,
      course: {
        all: isCheckAll,
        option: isCheckAll
          ? (courseOption as Course[])
          : item.length
          ? item
          : ["Computer Engineer"],
      },
    });
  };

  const handleOpenCourse = (flag: boolean) => {
    searchDispatch({
      type: "dropdown",
      payload: { ...searchState.dropDownState, course: flag },
    });
  };

  const dropdownContentCourse = () => (
    <div className="bg-white p-2 shadow-lg relative rounded-md">
      <Checkbox checked={courseOpt.all} onChange={handleCheckBxAllCourse}>
        All
      </Checkbox>
      <Checkbox.Group
        options={courseOption}
        value={courseOpt.option as string[]}
        onChange={handleCheckBxCourse}
      />
    </div>
  );

  return (
    <Dropdown
      open={searchState.dropDownState.course}
      onOpenChange={handleOpenCourse}
      dropdownRender={dropdownContentCourse}
      trigger={["click"]}
      getPopupContainer={() => document.getElementById("search-component")!}
      destroyPopupOnHide
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
  );
};

const DropdownYear = ({
  searchDispatch,
  searchState,
}: {
  searchDispatch: React.Dispatch<SearchAction>;
  searchState: SearchState;
}) => {
  const globalCtx = useGlobalContext();
  const { updateFilter } = globalCtx;
  const { years: yearsOpt } = globalCtx.state.filterState;
  const handleCheckBxDate = (valueType: CheckboxValueType[]) => {
    const isCheckAll = valueType.length === globalCtx.state.dateOption.length;
    const item = valueType as string[];
    updateFilter({
      ...globalCtx.state.filterState,
      years: {
        all: isCheckAll,
        option: isCheckAll
          ? globalCtx.state.dateOption
          : item.length
          ? item
          : [globalCtx.state.dateOption[globalCtx.state.dateOption.length - 1]],
      },
    });
  };

  const handleCheckBxAllDate = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    updateFilter({
      ...globalCtx.state.filterState,
      years: {
        all: isChecked,
        option: isChecked
          ? globalCtx.state.dateOption
          : [
              globalCtx.state.dateOption[
                globalCtx.state.dateOption.length - 1
              ].toString(),
            ],
      },
    });
  };

  const dropdownContentDate = () => (
    <div className="bg-white shadow-lg relative rounded-md p-2">
      <Checkbox checked={yearsOpt.all} onChange={handleCheckBxAllDate}>
        All
      </Checkbox>
      <Checkbox.Group
        // options={globalCtx.state.dateOption}
        value={yearsOpt.option}
        onChange={handleCheckBxDate}
      >
        <Row>
          {globalCtx.state.dateOption.map((years, index) => {
            return (
              <Col key={index} span={8}>
                <Checkbox value={years}>{years}</Checkbox>
              </Col>
            );
          })}
        </Row>
      </Checkbox.Group>
    </div>
  );
  const handleOpenDate = (flag: boolean) => {
    searchDispatch({
      type: "dropdown",
      payload: { ...searchState.dropDownState, date: flag },
    });
  };

  return (
    <Dropdown
      open={searchState.dropDownState.date}
      onOpenChange={handleOpenDate}
      dropdownRender={dropdownContentDate}
      trigger={["click"]}
      getPopupContainer={() => document.getElementById("search-component")!}
      destroyPopupOnHide
    >
      <div
        className="cursor-pointer text-slate-900"
        onClick={(e) => e.preventDefault()}
      >
        <Space>
          Date
          <DownOutlined />
        </Space>
      </div>
    </Dropdown>
  );
};

const SearchItem = (
  props: SearchState & { limit?: number; onShowMore?: () => void }
) => {
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
                  onClick: props.onShowMore,
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
