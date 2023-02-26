export type NavItemProps = {
  text: string;
  icon: React.ReactNode;
  href: string;
};

export type SearchState = {
  searchFocus: boolean;
  dropDownState: { course: boolean; date: boolean };
  checkBox: {
    course: { all: boolean; option: string[] };
    date: { all: boolean; option: string[] };
  };
};

export type SearchAction =
  | {
      type: "focus";
      payload: boolean;
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
    };

export const searchState_init: SearchState = {
  searchFocus: false,
  dropDownState: { course: false, date: false },
  checkBox: {
    course: { all: true, option: [] },
    date: { all: true, option: [] },
  },
};
