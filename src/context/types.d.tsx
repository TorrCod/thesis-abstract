import { ActivitylogReason } from "@/lib/types";
import { Unsubscribe } from "firebase/auth";
import { Dispatch, MutableRefObject } from "react";

export interface GlobalState {
  thesisItems: ThesisItems[];
  searchThesis: ThesisItems[];
  dateOption: string[];
  recyclebin: ThesisItems[];
  signIn?: boolean;
  loading: boolean;
  filterState: {
    years: { all: boolean; option: string[] };
    course: { all: boolean; option: Course[] };
  };
}

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
      type: "add-thesis";
      payload: ThesisItems;
    }
  | {
      type: "load-data";
      payload: {
        thesisItems: ThesisItems[];
        dateOpt: string[];
      };
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
      type: "update-filter";
      payload: {
        years: { all: boolean; option: string[] };
        course: { all: boolean; option: Course[] };
      };
    }
  | {
      type: "update-default-years";
      payload: string[];
    };

export type GlobalValue = {
  state: GlobalState;
  dispatch: Dispatch<GlobalAction>;
  loadThesisItems: () => Promise<void>;
  recycledThesis: () => {
    load: () => Promise<void>;
    clear: () => void;
  };
  updateFilter: (payload: {
    years: {
      all: boolean;
      option: string[];
    };
    course: {
      all: boolean;
      option: Course[];
    };
  }) => void;
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
  userName: string;
  _id: string;
  id: string;
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
