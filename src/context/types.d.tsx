import { Dispatch } from "react";

export interface GlobalState {
  thesisItems: ThesisItems[];
  searchItems: ThesisItems[];
  dateOption: string[];
  recyclebin: ThesisItems[];
  signIn?: boolean;
  loading: boolean;
}

export type Course =
  | "Computer Engineer"
  | "Mechanical Engineer"
  | "Electrical Engineer"
  | "Civil Engineer"
  | "Electronics Engineer";

export type ThesisItems = {
  id: string;
  title: string;
  researchers: string[];
  course: Course;
  abstract: string;
  date: string;
  dateAdded: Date;
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
      type: "search-data";
      payload: { text: string; filter: { course: Course[]; date: string[] } };
    }
  | {
      type: "sign-in";
      payload: boolean;
    }
  | {
      type: "load-recycle";
      payload: ThesisItems[];
    };

export type GlobalValue = {
  state: GlobalState;
  dispatch: Dispatch<GlobalAction>;
  loadThesisItems: () => Promise<void>;
  recycledThesis: (uid: string) => {
    load: () => Promise<void>;
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
};

export type UserState = {
  userDetails: UserDetails | undefined;
  listOfAdmins: AdminData[];
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
  loadUser: (uid: string) => void;
};

export type UserAction =
  | {
      type: "on-signin";
      payload: {
        userDetails?: UserDetails | null;
        allUsers?: AdminData[] | null;
      };
    }
  | { type: "on-signup"; payload: UserDetails }
  | {
      type: "on-logout";
    };
