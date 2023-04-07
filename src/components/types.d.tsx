import { Course, UserDetails } from "@/context/types.d";
import { ReactElement, ReactNode } from "react";

export type NavItemProps = {
  text: string;
  icon: React.ReactNode;
  href: string;
};

export type FilterCheckBox = {
  all: boolean;
  option: string[];
};

export type SearchState = {
  focus: boolean;
  searchTitle: string;
  dropDownState: { course: boolean; date: boolean };
  checkBox: {
    course: { all: boolean; option: string[] };
    date: { all: boolean; option: string[] };
  };
};

export const searchState_init: SearchState = {
  searchTitle: "",
  dropDownState: { course: false, date: false },
  checkBox: {
    course: { all: true, option: [] },
    date: { all: true, option: [] },
  },
  focus: false,
};

export const courseOption: Course[] = [
  "Computer Engineer",
  "Mechanical Engineer",
  "Electrical Engineer",
  "Civil Engineer",
  "Electronics Engineer",
];

export type SearchAction =
  | {
      type: "onchange";
      payload: string;
    }
  | {
      type: "dropdown";
      payload: { course: boolean; date: boolean };
    }
  | {
      type: "populate-option";
      payload: { course: string[]; date: string[] };
    }
  | {
      type: "oncheck-all";
      payload: { all: boolean; option: string[]; type: "course" | "date" };
    }
  | {
      type: "onfocus";
      payload: boolean;
    };

export type SearchProps = {
  className?: string;
  limit?: number;
  showFilter?: boolean;
  onSearch?: (payload: {
    title?: string;
    course?: Course[];
    year?: string[];
  }) => void;
};

export type AdminProps = {
  size?: { height: string; width: string };
  userDetails?: UserDetails;
  src?: string;
};

export type BottomMenuProps = {
  onchange: (selected: SelectedDashboardSider) => void;
  defaultSelected?: SelectedDashboardSider;
};

export type SelectedDashboardSider =
  | "/dashboard"
  | "/dashboard/users"
  | "/dashboard/admins"
  | "/dashboard/activitylog"
  | "/dashboard/thesis";
