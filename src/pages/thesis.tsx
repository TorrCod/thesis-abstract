import NavBar from "@/components/navbar";
import Search from "@/components/search";
import { Affix, Divider } from "antd";
import { Head } from "next/document";

const Thesis = () => {
  return (
    <>
      <main className="md:mt-20 md:grid md:place-items-center">
        <div className="grid w-full bg-[#38649C]">
          <Search className="max-w-[30em] place-self-center w-full my-5" />
        </div>
        <Divider className="bg-white/30" />
        <div className="grid gap-2 w-full shadow-md place-items-center md:grid-cols-2">
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
  return (
    <div className="w-full bg-slate-100 h-96 max-w-[50em] rounded-md"></div>
  );
};

export default Thesis;
