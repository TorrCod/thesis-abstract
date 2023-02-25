import NavBar from "@/components/navbar";
import Search from "@/components/search";
import { Affix, Divider } from "antd";
import { Head } from "next/document";

const Thesis = () => {
  return (
    <>
      <main className="md:mt-20 md:flex md:place-items-center md:flex-col">
        <div className="grid w-full">
          <Search className="max-w-[30em] place-self-center w-full my-5" />
          <Divider className="bg-white/30" />
        </div>
        <div className="grid gap-2 w-full place-items-center md:grid-cols-2">
          <Items />
          <Items />
        </div>
      </main>
    </>
  );
};

const Items = () => {
  return (
    <div className="w-full bg-slate-100 h-96 max-w-[50em] shadow-md rounded-md">
      <div>preview</div>
      <div>
        <span>Title</span>
        <h1>
          Thesis Abstract Thesis Abstract Management System for College of
          Engineering
        </h1>
      </div>
      <div>
        <span>Course</span>
        <h1>Computer Engineering</h1>
      </div>
      <div>
        <span>Date</span>
        <h1>01/01/2023</h1>
      </div>
    </div>
  );
};

export default Thesis;
