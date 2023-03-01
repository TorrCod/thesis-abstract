export interface GlobalState {
  thesisItems: ThesisItems[];
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

export type GlobalAction = {
  type: "add-thesis";
  payload: ThesisItems;
};
