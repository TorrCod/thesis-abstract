import {
  Checkbox,
  Col,
  Divider,
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
  FilterCheckBox,
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
import { TbSearchOff } from "react-icons/tb";
import { useRouter } from "next/router";

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

const Search = ({ className, limit, onSearch, showFilter }: SearchProps) => {
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

  useEffect(() => {
    if (!yearsOpt.option.length) {
      globalCtx.updateFilter({
        ...globalCtx.state.filterState,
        years: { all: true, option: globalCtx.state.dateOption },
      });
    }
    if (!courseOpt.option.length) {
      globalCtx.updateFilter({
        ...globalCtx.state.filterState,
        course: { all: true, option: courseOption },
      });
    }
  }, [yearsOpt.option.length, courseOpt.option.length]);

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
      {(searchState.focus || showFilter) && (
        <div className="mt-2">
          <div className="flex gap-5" id="filter-component">
            <div>
              <DropDownCourse
                searchDispatch={searchDispatch}
                searchState={searchState}
              />
              {courseOpt.all ? (
                <FilterItems type="course" items={["All"]} noAction />
              ) : (
                <FilterItems
                  type="course"
                  items={courseOpt.option as string[]}
                />
              )}
            </div>
            <div>
              <DropdownYear
                searchDispatch={searchDispatch}
                searchState={searchState}
              />
              {yearsOpt.all ? (
                <FilterItems type="years" items={["All"]} noAction />
              ) : (
                <FilterItems type="years" items={yearsOpt.option as string[]} />
              )}
            </div>
          </div>
        </div>
      )}
      <div className={`w-fulls rounded-md overflow-hidden relative z-20`}>
        {searchState.focus && (
          <SearchItem
            filter={{
              course: !courseOpt.all ? courseOpt.option : undefined,
              years: !yearsOpt.all ? yearsOpt.option : undefined,
            }}
            searchDispatch={searchDispatch}
            {...searchState}
            limit={limit}
            onShowMore={handleShowMore}
          />
        )}
      </div>
    </div>
  );
};

const FilterItems = ({
  items,
  noAction,
  type,
}: {
  items: string[];
  noAction?: boolean;
  type: "course" | "years";
}) => {
  const { updateFilter, state } = useGlobalContext();
  const handleRemove = (item: string) => {
    const searchFilter = { ...state.filterState };
    searchFilter[type].option = (searchFilter[type].option as string[]).filter(
      (oldItem) => oldItem !== item
    );
    updateFilter(searchFilter);
  };

  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item, index) => (
        <div
          key={index}
          className={`text-white text-[0.6em] bg-[#38649C] rounded-full w-fit px-2 py-1 text-center min-w-[4em] ${
            !noAction && `cursor-pointer`
          }`}
          onClick={() => (noAction ? {} : handleRemove(item))}
        >
          {item} {!noAction && "x"}
        </div>
      ))}
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
    <div className="bg-white p-2 shadow-lg relative rounded-md grid">
      <Checkbox
        className="w-fit"
        checked={courseOpt.all}
        onChange={handleCheckBxAllCourse}
      >
        All
      </Checkbox>
      <Checkbox.Group
        // options={courseOption}
        value={courseOpt.option as string[]}
        onChange={handleCheckBxCourse}
      >
        <Row>
          {courseOption.map((course, index) => {
            return (
              <Col key={index} span={12}>
                <Checkbox value={course}>{course}</Checkbox>
              </Col>
            );
          })}
        </Row>
      </Checkbox.Group>
    </div>
  );

  return (
    <Dropdown
      open={searchState.dropDownState.course}
      onOpenChange={handleOpenCourse}
      dropdownRender={dropdownContentCourse}
      getPopupContainer={() => document.getElementById("filter-component")!}
      destroyPopupOnHide
      autoAdjustOverflow
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
    <div className="bg-white shadow-lg relative rounded-md p-2 grid">
      <div>
        <Checkbox
          className="w-fit"
          checked={yearsOpt.all}
          onChange={handleCheckBxAllDate}
        >
          All
        </Checkbox>
      </div>
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
      getPopupContainer={() => document.getElementById("filter-component")!}
      destroyPopupOnHide
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
  );
};

const SearchItem = (
  props: SearchState & {
    limit?: number;
    onShowMore?: () => void;
    searchDispatch: React.Dispatch<SearchAction>;
    filter: { course?: Course[]; years?: string[] };
  }
) => {
  const [menuItem, setMenuItem] = useState<MenuProps["items"]>([]);
  let searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  useEffect(() => {
    clearTimeout(searchTimeoutRef.current ?? 0);
    searchTimeoutRef.current = setTimeout(() => {
      getAllThesis(
        {
          title: props.searchTitle,
          course: props.filter.course,
          year: props.filter.years,
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
              label: <Link href={`/thesis/${item._id}`}>{item.title}</Link>,
            };
          });
          if (!myMenu.length) {
            setMenuItem([
              {
                label: `No results found ${
                  props.searchTitle ? `for '${props.searchTitle}'` : ""
                }`,
                key: "no-result",
                icon: <TbSearchOff />,
              },
            ]);
          } else if (myMenu.length >= (props.limit ?? 10)) {
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
    }, 200);
    return () => clearTimeout(searchTimeoutRef.current ?? 0);
  }, [props.checkBox, props.searchTitle, props.filter]);

  const handleSelect: MenuProps["onSelect"] = (item) => {
    props.searchDispatch({ type: "onfocus", payload: false });
  };
  return <Menu className="mt-2" onSelect={handleSelect} items={menuItem} />;
};

export default Search;
