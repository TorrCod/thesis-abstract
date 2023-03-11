import { PriButton } from "@/components/button";
import Search from "@/components/search";
import { ThesisItems } from "@/context/types.d";
import { Divider } from "antd";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { generateId, getData } from "@/lib/mongo";
import dynamic from "next/dynamic";
import Head from "next/head";

const PdfLink = dynamic(() => import("@/components/pdfDocs"), {
  ssr: false,
});

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const res = await getData("thesis-abstract", "thesis-items");
    const thesisItems: ThesisItems[] = generateId(res);
    const itemId = context.params?.id;
    const foundItem = thesisItems.find((item) => itemId === item["id"]);
    return {
      props: { data: foundItem },
    };
  } catch {
    return {
      props: { hasError: true },
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await getData("thesis-abstract", "thesis-items");
    const thesisItems: ThesisItems[] = generateId(res);
    const pathWithParams = thesisItems.map((item) => ({
      params: { id: item.id },
    }));
    return {
      paths: pathWithParams,
      fallback: true,
    };
  } catch {
    return { paths: [], fallback: true };
  }
};

const ThesisItemsView = (props: { data: ThesisItems; hasError: boolean }) => {
  const router = useRouter();
  if (props.hasError) {
    return <h1>Error - please try another parameter</h1>;
  }
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <Head>
        <title>{props.data.title}</title>
        <meta
          name="description"
          content="Web based Thesis Abstract Management System for College of Engineering"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className="flex flex-col gap-1 md:pt-20 items-center">
        <Search />
        <Divider />
        <div className="rs-container bg-slate-100 rounded-md max-w-5xl grid p-5 gap-2 md:gap-5 w-full relative">
          <div className="rs-preview p-3 bg-white shadow-md rounded-sm h-52 overflow-hidden text-[0.1em] relative max-w-[100em] text-justify justify-self-center">
            <div className="w-full h-full overflow-hidden">
              <div className="text-center">Abstract</div>
              <p className="indent-3">{props.data.abstract}</p>
            </div>
          </div>
          <div className="rs-details grid gap-2">
            <div>
              <span className="text-sm text-[#38649C]">Title</span>
              <h2>{props.data.title}</h2>
            </div>
            <div>
              <span className="text-sm text-[#38649C]">Course</span>
              <h2>{props.data.course}</h2>
            </div>
            <div>
              <span className="text-sm text-[#38649C]">Date</span>
              <h2>{props.data.date}</h2>
            </div>
          </div>
          <div className="rs-researchers">
            <span className="text-sm text-[#38649C]">Researchers</span>
            <div className="pl-5">
              <ul className="list-disc">
                {props.data.researchers.map((child, index) => (
                  <li key={index}>{child}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rs-abstract justify-self-center text-justify leading-10 w-full">
            <div className="max-w-xl">
              <h3 className="text-center">Abstract</h3>
              <p className="indent-5">{props.data.abstract}</p>
            </div>
          </div>
          <div className="rs-button grid place-items-end md:place-items-start">
            <Divider />
            <PriButton>
              <PdfLink {...props.data} />
            </PriButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default ThesisItemsView;
