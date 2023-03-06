import { Dispatch } from "react";

export interface GlobalState {
  thesisItems: ThesisItems[];
  searchItems: ThesisItems[];
  dateOption: string[];
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
};

export type GlobalAction =
  | {
      type: "add-thesis";
      payload: ThesisItems;
    }
  | {
      type: "load-data";
      payload: { thesisItems: ThesisItems[]; dateOpt: string[] };
    }
  | {
      type: "search-data";
      payload: { text: string; filter: { course: Course[]; date: string[] } };
    };

export type GlobalValue = {
  state: GlobalState;
  dispatch: Dispatch<GlobalAction>;
};

export type UserState = {
  userDetails: UserDetails | undefined;
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
};

export type UserValue = {
  state: UserState;
  dispatch: Dispatch<UserAction>;
  userSignUp?: (userDetails: UserDetails) => Promise<void>;
  userUpdateInfo?: (userDetails: UserDetails) => Promise<void>;
  changePass?: (currpass: string, newpass: string) => Promise<void>;
  updateProfileUrl?: (userDetails: UserDetails) => Promise<void>;
  deleteAccount?: (currpass: string) => Promise<void>;
};

export type UserAction =
  | { type: "on-signin"; payload: UserDetails | undefined }
  | { type: "on-signup"; payload: UserDetails };
