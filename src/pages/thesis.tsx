import NavBar from "@/components/navbar";
import Search from "@/components/search";
import { Divider } from "antd";
import { Head } from "next/document";

const Thesis = () => {
  return (
    <>
      <main>
        <Search />
        <Divider />
        <div className="grid gap-2 shadow-md">
          <Items />
          <Items />
          <Items />
          <Items />
          <Items />
          <Items />
          <Items />
          <Items />
          <Items />
        </div>
      </main>
    </>
  );
};

const Items = () => {
  return <div className="w-full bg-slate-100 h-96 rounded-md"></div>;
};

export default Thesis;
