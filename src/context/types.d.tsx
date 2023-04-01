import { ActivitylogReason, SocketEmitEvent, _Socket } from "@/lib/types";
import { Unsubscribe } from "firebase/auth";
import { Dispatch, MutableRefObject } from "react";

export interface GlobalState {
  thesisItems: ThesisState;
  searchThesis: ThesisItems[];
  dateOption: string[];
  recyclebin: ThesisItems[];
  signIn?: boolean;
  loading: string[];
  totalThesisCount: { thesisCount: ThesisCount; totalCount: number };
  searchingAction: SearchAction;
}

export type SearchAction = {
  searchTitle?: string;
  pageNo?: number;
  filterState: FilterState;
};

export type FilterState = {
  years: { all: boolean; option: string[] };
  course: { all: boolean; option: Course[] };
};

export type ThesisCount = { course: Course; count: number }[];

export type ThesisState = {
  currentPage: number;
  totalCount: number;
  document: ThesisItems[];
};

export type Course =
  | "Computer Engineer"
  | "Mechanical Engineer"
  | "Electrical Engineer"
  | "Civil Engineer"
  | undefined
  | "Electronics Engineer";

export type ThesisItems = {
  id: string;
  title: string;
  researchers: string[];
  course: Course;
  abstract: string;
  year: number;
  dateAdded: Date;
  _id?: string;
};

export type SearchQuery = {
  course?: Course[];
  year?: string[];
  title?: string;
};

export type SearchOption = {
  limit?: number;
  projection?: Record<string, 0 | 1>;
};

export type GlobalAction =
  | {
      type: "on-search-action";
      payload: {
        searchTitle?: string;
        thesisPageNo?: number;
        filterState: FilterState;
      };
    }
  | {
      type: "add-thesis";
      payload: ThesisItems;
    }
  | {
      type: "load-thesis";
      payload: ThesisState;
    }
  | {
      type: "sign-in";
      payload: boolean;
    }
  | {
      type: "load-recycle";
      payload: ThesisItems[];
    }
  | {
      type: "update-default-years";
      payload: string[];
    }
  | {
      type: "add-loading";
      payload: string[];
    }
  | {
      type: "load-thesis-count";
      payload: { thesisCount: ThesisCount; totalCount: number };
    };

export type GlobalValue = {
  state: GlobalState;
  dispatch: Dispatch<GlobalAction>;
  loadThesisItems: () => Promise<void>;
  loadRecycle: () => Promise<void>;
  loadThesisCount: () => Promise<void>;
  loadingState: {
    add(key: string): void;
    remove(key: string): void;
  };
  promptToSignIn: () => void;
  addThesisItem: (document: ThesisItems) => void;
  removeThesisItem: (_id: string) => void;
  restoreThesis: (_id: string) => void;
  recycleThesis: (thesis: ThesisItems) => void;
  updateSearchAction: () => {
    update: (payload: SearchAction) => void;
    clear: () => void;
  };
};

export type AdminData = {
  key: string;
  name?: string;
  dateAdded: string;
  email: string;
  course?: string;
  status: React.ReactNode;
} & UserDetails;

export type UserState = {
  userDetails: UserDetails | undefined;
  listOfAdmins: AdminData[];
  activityLog: ActivityLog[];
};

export type ActivityLog = {
  userId: string;
  userName: string;
  _id: string;
  data: { itemId: string; name: string };
  date: string;
  reason: ActivitylogReason;
};

export type UserDetails = {
  firstName: string;
  lastName: string;
  course: Course;
  email: string;
  userName: string;
  profilePic?: string;
  approove?: string;
  uid?: string;
  _id?: any;
  password?: string;
  dateAdded?: string;
  status?: "Pending" | "Admin";
};

export type UserValue = {
  state: UserState;
  dispatch: Dispatch<UserAction>;
  userSignUp?: (userDetails: UserDetails) => Promise<void>;
  userUpdateInfo?: (userDetails: UserDetails) => Promise<void>;
  changePass?: (currpass: string, newpass: string) => Promise<void>;
  updateProfileUrl?: (userDetails: UserDetails) => Promise<void>;
  deleteAccount?: (currpass: string) => Promise<void>;
  saveUploadThesis: (data: ThesisItems) => Promise<void>;
  loadAllUsers: () => Promise<void>;
  unsubscribeRef: MutableRefObject<Unsubscribe | null>;
  loadActivityLog: () => Promise<ActivityLog[]>;
  logOut: () => Promise<void>;
};

export type PendingAdminList = {
  _id: string;
  email: string;
  approove: string;
  createdAt: string;
  expireAfterSeconds: number;
  firstName: string | "----";
  lastName: string | "----";
  course: Course;
  userName: string | "----";
};

export type UserAction =
  | {
      type: "on-signin";
      payload: {
        userDetails?: UserDetails | null;
      };
    }
  | { type: "on-signup"; payload: UserDetails }
  | {
      type: "on-logout";
    }
  | {
      type: "load-all-users";
      payload: {
        adminList: UserDetails[];
        pendingAdminList: PendingAdminList[];
      };
    }
  | {
      type: "load-activity-log";
      payload: ActivityLog[];
    };

export type SocketValue = {
  triggerSocket: (event: SocketEmitEvent) => void;
};
