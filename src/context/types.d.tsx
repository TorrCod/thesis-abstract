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
  | "Civil Engineer";

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
