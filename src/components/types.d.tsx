import { Course, UserDetails } from "@/context/types.d";

export type NavItemProps = {
  text: string;
  icon: React.ReactNode;
  href: string;
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
  defaultSelected: SelectedDashboardSider;
};

export type SelectedDashboardSider =
  | "/dashboard/overview"
  | "/dashboard/users"
  | "/dashboard/admins"
  | "/dashboard/activitylog"
  | "/dashboard/thesis";
