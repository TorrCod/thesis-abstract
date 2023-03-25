import Search from "@/components/search";
import { ThesisItems } from "@/context/types.d";
import { Divider } from "antd";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { getData } from "@/lib/mongo";
import { parseQuery } from "@/utils/server-utils";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const query = ctx.query;
  const parsedQuery = parseQuery(query);
  const thesisItems = await getData(
    "thesis-abstract",
    "thesis-items",
    parsedQuery,
    {
      limit: 20,
    }
  );
  const response = thesisItems.map((item) => {
    (item._id as unknown as string) = item._id.toString();
    return item;
  });
  return {
    props: { thesisItems: response },
  };
};

const Thesis = (props: { thesisItems: ThesisItems[] }) => {
  return (
    <>
      <Head>
        <title>Collection of Thesis Abstract</title>
        <meta
          name="description"
          content="Web based Thesis Abstract Management System for College of Engineering"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section>
        <div className="md:pt-20 md:flex md:place-items-center md:flex-col">
          <div className="grid w-full relative">
            <Search className="place-self-center my-5 w-full max-w-3xl z-10 absolute top-0" />
            {/* <SelectedFilter /> */}
            <Divider className="bg-white/30 mt-32" />
          </div>
          <div className="grid gap-2 w-full place-items-center lg:grid-cols-2 relative md:px-5">
            {props.thesisItems?.map((props) => {
              return <Items key={props._id} {...props} />;
            })}
          </div>
        </div>
      </section>
    </>
  );
};

const Items = ({
  title,
  course,
  researchers,
  abstract,
  _id,
  year,
}: ThesisItems) => {
  return (
    <div className="thesis_items w-full bg-slate-100 max-w-[50em] shadow-md rounded-md p-5 gap-2 md:gap-5 grid h-full">
      <div className="div2 flex flex-col gap-2">
        <div>
          <Link href={`/thesis/${_id}`}>
            <span className="text-sm text-[#38649C]">Title</span>
            <h2>{title}</h2>
          </Link>
        </div>
        <div>
          <span className="text-sm text-[#38649C]">Course</span>
          <h2>{course}</h2>
        </div>
        <div>
          <span className="text-sm text-[#38649C]">year</span>
          <h2>{year}</h2>
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
      <div className="div1 p-3 bg-white shadow-md rounded-sm h-52 overflow-h_idden text-[0.7em] relative text-justify justify-self-center leading-4 ">
        <Link href={`/thesis/${_id}`}>
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
