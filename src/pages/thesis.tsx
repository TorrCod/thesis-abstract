import { PriButton } from "@/components/button";
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
        <div className="grid gap-2 w-full place-items-center lg:grid-cols-2">
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
    <div className="thesis_items w-full bg-slate-100 md:h-82 h-auto max-w-[50em] shadow-md rounded-md p-5 gap-5 grid">
      <div className="div1 grid place-items-center bg-white shadow-md rounded-sm max-w-xs min-h-[25em] md:min-h-[20] place-self-center w-full">
        preview
      </div>
      <div className="div2 flex flex-col py-5 gap-5">
        <div>
          <span className="text-sm text-[#38649C]">Title</span>
          <h2>
            Thesis Abstract Thesis Abstract Management System for College of
            Engineering
          </h2>
        </div>
        <div>
          <span className="text-sm text-[#38649C]">Course</span>
          <h2>Computer Engineering</h2>
        </div>
        <div>
          <span className="text-sm text-[#38649C]">Date</span>
          <h2>01/01/2023</h2>
        </div>
      </div>
      <div className="div3 p-5">
        <div>
          <span className="text-sm text-[#38649C]">Researchers</span>
          <ul className="list-disc">
            <li>Christian Bert Torres</li>
            <li>Randyl Son Aradanas</li>
            <li>John Patrick Alcantara</li>
            <li>Ildefonso Mathew Perry Patena</li>
          </ul>
        </div>
      </div>
      <div className="div4 grid place-items-end">
        <PriButton>Download</PriButton>
      </div>
    </div>
  );
};

export default Thesis;
