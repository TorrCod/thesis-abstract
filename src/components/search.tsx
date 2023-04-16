import {
  Checkbox,
  Col,
  Dropdown,
  Form,
  Input,
  InputRef,
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
import { TbSearchOff } from "react-icons/tb";
import { useRouter } from "next/router";
import axios from "axios";

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
  const { state, updateSearchAction } = useGlobalContext();
  const { course: courseOpt, years: yearsOpt } =
    state.searchingAction.filterState;
  const searchRef = useRef<HTMLDivElement>(null);
  const onSearchRef = useRef<HTMLAnchorElement>(null);
  useClickAway(searchRef, () => {
    searchDispatch({ type: "onfocus", payload: false });
  });
  const inputRef = useRef<InputRef>(null);

  const handleSearch = () => {
    const title = searchState.searchTitle;
    const course: Course[] = courseOpt.option as any;
    const year = yearsOpt.option;
    onSearch?.({ title, course, year });
    inputRef.current?.blur();
    searchDispatch({ type: "onfocus", payload: false });
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    updateSearchAction().update({
      ...state.searchingAction,
      searchTitle:
        e.currentTarget.value === "" ? undefined : e.currentTarget.value,
    });
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
          placeholder="Search Title"
          ref={inputRef}
        />
        <Link
          aria-label="Goto Collection of Thesis"
          ref={onSearchRef}
          href={`/thesis?${
            state.searchingAction.searchTitle
              ? `title=${state.searchingAction.searchTitle}`
              : ``
          }${
            state.searchingAction.filterState.course.all
              ? ``
              : `&course=${encodeURIComponent(
                  JSON.stringify(
                    state.searchingAction.filterState.course.option
                  )
                )}`
          }${
            yearsOpt.all
              ? ``
              : `&year=${encodeURIComponent(JSON.stringify(yearsOpt.option))}`
          }`}
        >
          <PriButton
            aria-label="View Thesis"
            htmlType="submit"
            onClick={handleSearch}
          >
            <BsSearch color="white" />
          </PriButton>
        </Link>
      </Form>
      <div className={`mt-2 ${!searchState.focus && !showFilter && `hidden`}`}>
        <div className="flex gap-5" id="filter-component">
          <div>
            <DropDownCourse
              searchDispatch={searchDispatch}
              searchState={searchState}
            />
            {state.searchingAction.filterState.course.all ? (
              <FilterItems type="course" items={["All"]} noAction />
            ) : (
              <FilterItems
                type="course"
                items={
                  state.searchingAction.filterState.course.option as string[]
                }
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
      <div className={`w-fulls rounded-md overflow-hidden relative z-20`}>
        {searchState.focus && (
          <SearchItem
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
  const { state, updateSearchAction } = useGlobalContext();
  const handleRemove = (item: string) => {
    const searchFilter = { ...state.searchingAction.filterState };
    searchFilter[type].option = (searchFilter[type].option as string[]).filter(
      (oldItem) => oldItem !== item
    );
    if (!searchFilter[type].option?.length) {
      searchFilter[type].all = true;
      searchFilter[type].option = searchFilter[type].default;
    }
    updateSearchAction().update({
      ...state.searchingAction,
      filterState: searchFilter,
    });
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
  const { updateSearchAction } = globalCtx;
  const { course: courseOpt } = globalCtx.state.searchingAction.filterState;

  const handleCheckBxAllCourse = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    const newFilterState = { ...globalCtx.state.searchingAction.filterState };
    newFilterState.course.all = isChecked;
    (newFilterState.course.option = isChecked
      ? (courseOption as Course[])
      : ["Computer Engineer"]),
      updateSearchAction().update({
        ...globalCtx.state.searchingAction,
        filterState: newFilterState,
      });
  };
  const handleCheckBxCourse = (valueType: CheckboxValueType[]) => {
    const isCheckAll = valueType.length === courseOption.length;
    const item = valueType as Course[];
    const newFilterState = { ...globalCtx.state.searchingAction.filterState };
    newFilterState.course.all = isCheckAll;
    newFilterState.course.option = isCheckAll
      ? (courseOption as Course[])
      : item.length
      ? item
      : ["Computer Engineer"];
    updateSearchAction().update({
      ...globalCtx.state.searchingAction,
      filterState: newFilterState,
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
      <div className="cursor-pointer text-slate-900">
        <Space>
          Course
          <DownOutlined />
        </Space>
      </div>
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
  const { updateSearchAction } = globalCtx;
  const { years: yearsOpt } = globalCtx.state.searchingAction.filterState;

  const handleCheckBxDate = (valueType: CheckboxValueType[]) => {
    const isCheckAll = valueType.length === globalCtx.state.dateOption.length;
    const item = valueType as string[];

    const newFilterState = { ...globalCtx.state.searchingAction.filterState };
    newFilterState.years.all = isCheckAll;
    newFilterState.years.option = isCheckAll
      ? globalCtx.state.dateOption
      : item.length
      ? item
      : [globalCtx.state.dateOption[0]];
    updateSearchAction().update({
      ...globalCtx.state.searchingAction,
      filterState: newFilterState,
    });
  };
  const handleCheckBxAllDate = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    const newFilterState = { ...globalCtx.state.searchingAction.filterState };
    newFilterState.years.all = isChecked;
    (newFilterState.years.option = isChecked
      ? globalCtx.state.dateOption
      : [globalCtx.state.dateOption[0].toString()]),
      updateSearchAction().update({
        ...globalCtx.state.searchingAction,
        filterState: newFilterState,
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
      <div className="cursor-pointer text-slate-900">
        <Space>
          Year
          <DownOutlined />
        </Space>
      </div>
    </Dropdown>
  );
};

const SearchItem = (
  props: SearchState & {
    limit?: number;
    onShowMore?: () => void;
    searchDispatch: React.Dispatch<SearchAction>;
  }
) => {
  const [menuItem, setMenuItem] = useState<MenuProps["items"]>(menuLoading);
  let searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);
  const { state } = useGlobalContext();
  const cancelTokenRef = useRef(axios.CancelToken.source());

  useEffect(() => {
    clearTimeout(searchTimeoutRef.current ?? 0);
    cancelTokenRef.current.cancel();
    searchTimeoutRef.current = setTimeout(() => {
      cancelTokenRef.current = axios.CancelToken.source();
      setLoading(true);
      getAllThesis(
        {
          title: state.searchingAction.searchTitle,
          course: state.searchingAction.filterState.course.option,
          year: state.searchingAction.filterState.years.option,
        },
        {
          limit: props.limit ?? 10,
          projection: { _id: 1, title: 1 },
        },
        undefined,
        undefined,
        cancelTokenRef.current.token
      )
        .then((res) => {
          const myMenu: MenuProps["items"] = res.document.map((item) => {
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
          if (e?.name === "CanceledError") return;
          console.error(e);
        })
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(searchTimeoutRef.current ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.searchingAction.searchTitle,
    props.limit,
    state.searchingAction.filterState,
  ]);

  const handleSelect: MenuProps["onSelect"] = (item) => {
    props.searchDispatch({ type: "onfocus", payload: false });
  };
  return (
    <Menu
      onSelect={handleSelect}
      className="mt-2"
      items={loading ? menuLoading : menuItem}
    />
  );
};

const menuLoading = [
  {
    key: 1,
    label: <div className="sk_bg h-4 mt-3 w-full" />,
  },
  {
    key: 2,
    label: <div className="sk_bg h-4 mt-3 w-full" />,
  },
  {
    key: 3,
    label: <div className="sk_bg h-4 mt-3 w-full" />,
  },
  {
    key: 4,
    label: <div className="sk_bg h-4 mt-3 w-full" />,
  },
  {
    key: 5,
    label: <div className="sk_bg h-4 mt-3 w-full" />,
  },
];

export default Search;
