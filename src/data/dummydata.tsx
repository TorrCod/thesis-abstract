import { ThesisItems } from "@/context/types.d";
import { thesisToDataType } from "@/utils/helper";

const dummyData: ThesisItems[] = [
  {
    id: "1",
    title: "Optimizing Resource Allocation in Cloud Computing",
    researchers: ["John Smith", "Emily Johnson"],
    course: "Computer Engineer",
    abstract:
      "This thesis proposes a novel resource allocation strategy in cloud computing...",
    date: "2022-05-20",
    dateAdded: new Date("2022-05-22"),
  },
  {
    id: "2",
    title: "Design and Fabrication of a Miniature Wind Turbine",
    researchers: ["David Lee", "Maria Rodriguez"],
    course: "Mechanical Engineer",
    abstract:
      "This thesis presents the design and fabrication process of a miniature wind turbine...",
    date: "2021-12-15",
    dateAdded: new Date("2021-12-18"),
  },
  {
    id: "3",
    title: "Efficient Power Management in Smart Grids",
    researchers: ["Michael Brown", "Sophia Hernandez", "Oliver Davis"],
    course: "Electrical Engineer",
    abstract:
      "This thesis proposes an efficient power management system for smart grids...",
    date: "2023-02-28",
    dateAdded: new Date("2023-03-02"),
  },
  {
    id: "4",
    title: "Evaluating the Performance of Different Concrete Mixtures",
    researchers: ["Liam Johnson", "Emma Thompson"],
    course: "Civil Engineer",
    abstract:
      "This thesis evaluates the performance of different concrete mixtures in various conditions...",
    date: "2022-08-10",
    dateAdded: new Date("2022-08-12"),
  },
  {
    id: "5",
    title: "Design and Implementation of a Home Automation System",
    researchers: ["Nathan Kim", "Ava Jones"],
    course: "Electronics Engineer",
    abstract:
      "This thesis presents the design and implementation process of a home automation system...",
    date: "2021-06-05",
    dateAdded: new Date("2021-06-07"),
  },
];

export const tableData = thesisToDataType(dummyData);

export const activity = [
  {
    label: "Date",
    children: "added thesis abstracts",
    color: "green",
  },
  {
    label: "Date",
    children: "rejected a user",
    color: "red",
  },
  {
    label: "Date",
    children: "approoved a user",
    color: "green",
  },
  {
    label: "Date",
    children: "deleted thesis abstracts",
    color: "red",
  },
  {
    label: "Date",
    children: "added thesis abstracts",
    color: "green",
  },
  {
    label: "Date",
    children: "removed an admin",
    color: "red",
  },
  {
    label: "Date",
    children: "approoved a user",
    color: "green",
  },
  {
    label: "Date",
    children: "deleted thesis abstracts",
    color: "red",
  },
  {
    label: "Date",
    children: "added thesis abstracts",
    color: "green",
  },
  {
    label: "Date",
    children: "rejected a user",
    color: "red",
  },
];
