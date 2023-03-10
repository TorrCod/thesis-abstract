import Search from "@/components/search";
import useGlobalContext from "@/context/globalContext";
import { ThesisItems } from "@/context/types.d";
import { Divider } from "antd";
import Link from "next/link";

// use pdf lib for creating pdf

const Thesis = () => {
  const { state } = useGlobalContext();
  return (
    <section>
      <div className="md:pt-20 md:flex md:place-items-center md:flex-col">
        <div className="grid w-full">
          <Search className="place-self-center my-5" />
          <Divider className="bg-white/30" />
        </div>
        <div className="grid gap-2 w-full place-items-center lg:grid-cols-2 relative">
          {state.searchItems.map((props) => {
            return <Items key={props.id} {...props} />;
          })}
        </div>
      </div>
    </section>
  );
};

const Items = ({
  title,
  course,
  researchers,
  abstract,
  id,
  date,
}: ThesisItems) => {
  return (
    <div className="thesis_items w-full bg-slate-100 max-w-[50em] shadow-md rounded-md p-5 gap-2 md:gap-5 grid">
      <div className="div2 flex flex-col gap-2">
        <div>
          <Link href={`/thesis/${id}`}>
            <span className="text-sm text-[#38649C]">Title</span>
            <h2>{title}</h2>
          </Link>
        </div>
        <div>
          <span className="text-sm text-[#38649C]">Course</span>
          <h2>{course}</h2>
        </div>
        <div>
          <span className="text-sm text-[#38649C]">Date</span>
          <h2>{date}</h2>
        </div>
      </div>
      <div className="div3">
        <span className="text-sm text-[#38649C]">Researchers</span>
        <div className="pl-5">
          <ul className="list-disc">
            {researchers.map((child, index) => {
              return <li key={index}>{child}</li>;
            })}
          </ul>
        </div>
      </div>
      <div className="div1 p-3 bg-white shadow-md rounded-sm h-52 overflow-hidden text-[0.1em] relative max-w-[100em] text-justify justify-self-center leading-3">
        <Link href={`/thesis/${id}`}>
          <div className="overflow-hidden w-full h-full">
            <h4 className="text-center">Abstract</h4>
            <p className="indent-3">{abstract}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Thesis;
