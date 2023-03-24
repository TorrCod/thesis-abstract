import Search from "@/components/search";
import useGlobalContext from "@/context/globalContext";
import { SearchThesis, ThesisItems } from "@/context/types.d";
import { Divider } from "antd";
import Head from "next/head";
import Link from "next/link";

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from "next";
import { getAllThesis } from "@/utils/thesis-item-utils";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { year, course, title, limit }: SearchThesis = ctx.query;
  const data = await getAllThesis({ limit, year, course, title });
  return {
    props: {
      thesisItems: data,
    },
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
          <div className="grid w-full">
            <Search className="place-self-center my-5" />
            {/* <SelectedFilter /> */}
            <Divider className="bg-white/30" />
          </div>
          <div className="grid gap-2 w-full place-items-center lg:grid-cols-2 relative">
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
  date,
}: ThesisItems) => {
  return (
    <div className="thesis_items w-full bg-slate-100 max-w-[50em] shadow-md rounded-md p-5 gap-2 md:gap-5 grid">
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
