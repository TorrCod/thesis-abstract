import { PriButton } from "@/components/button";
import Search from "@/components/search";
import { ThesisItems } from "@/context/types.d";
import { Divider } from "antd";
import { getData, getOneData } from "@/lib/mongo";
import dynamic from "next/dynamic";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { ObjectId } from "mongodb";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useGlobalContext from "@/context/globalContext";
import { getAllThesis, getOneById } from "@/utils/thesis-item-utils";

const PdfLink = dynamic(() => import("@/components/pdfDocs"), {
  ssr: false,
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const itemId = (context.params as any).id as string;
    if (!itemId) {
      throw new Error("no params");
    }
    const isExist = await getOneData(
      "thesis-abstract",
      "thesis-items",
      { _id: new ObjectId(itemId) },
      { projection: { _id: 1 } }
    );
    if (!isExist) throw new Error("not found");
    return { props: { _id: itemId } };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

const ThesisItemsView = (props: { _id: string }) => {
  const router = useRouter();
  const [data, setData] = useState<ThesisItems>();

  useEffect(() => {
    const fetchData = async () => {
      const thesisItem = await getOneById(props._id);
      setData(thesisItem);
    };
    fetchData();
  }, [router]);

  return !data ? (
    <Loading />
  ) : (
    <>
      <Head>
        <title>{data.title}</title>
        <meta
          name="description"
          content="Web based Thesis Abstract Management System for College of Engineering"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className="flex flex-col gap-1 md:pt-20 items-center">
        <div className="relative z-10 w-full">
          <Search className="w-screen max-w-lg absolute top-0 left-0 right-0 m-auto" />
        </div>
        <Divider />
        <div className="rs-container bg-slate-100 rounded-md max-w-5xl grid p-5 gap-2 md:gap-5 w-full relative">
          <div className="rs-preview p-3 bg-white shadow-md rounded-sm h-52 overflow-hidden text-[0.7em] relative text-justify justify-self-center">
            <div className="w-full h-full overflow-hidden">
              <div className="text-center">Abstract</div>
              <p className="indent-3">{data.abstract}</p>
            </div>
          </div>
          <div className="rs-details grid gap-2">
            <div>
              <span className="text-sm text-[#38649C]">Title</span>
              <h2>{data.title}</h2>
            </div>
            <div>
              <span className="text-sm text-[#38649C]">Course</span>
              <h2>{data.course}</h2>
            </div>
            <div>
              <span className="text-sm text-[#38649C]">Year</span>
              <h2>{data.year}</h2>
            </div>
          </div>
          <div className="rs-researchers">
            <span className="text-sm text-[#38649C]">Researchers</span>
            <div className="pl-5">
              <ul className="list-disc">
                {data.researchers.map((child, index) => (
                  <li key={index}>{child}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rs-abstract justify-self-center text-justify leading-10 w-full">
            <div className="max-w-xl">
              <h3 className="text-center">Abstract</h3>
              <p className="indent-20">{data.abstract}</p>
            </div>
          </div>
          <div className="rs-button grid place-items-end md:place-items-start">
            <Divider />
            <PriButton>
              <PdfLink {...data} />
            </PriButton>
          </div>
        </div>
      </section>
    </>
  );
};

const Loading = () => {
  return (
    <>
      <Head>
        <title>Thesis Abstract</title>
        <meta
          name="description"
          content="Web based Thesis Abstract Management System for College of Engineering"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className="flex flex-col gap-1 md:pt-20 items-center">
        <div className="relative z-10 w-full">
          <Search className="w-screen max-w-lg absolute top-0 left-0 right-0 m-auto" />
        </div>
        <Divider />
        <div className="rs-container bg-slate-100 rounded-md max-w-5xl grid p-5 gap-2 md:gap-5 w-full relative">
          <div className="rs-preview p-3 bg-white shadow-md rounded-sm h-52 overflow-hidden text-[0.7em] relative text-justify justify-self-center w-full">
            <div className="w-full h-fit overflow-hidden grid gap-1">
              <div className="sk_bg w-full max-w-[7em] mx-auto h-2"></div>
              <div className="sk_bg w-full max-w-[23em] h-2 place-self-end"></div>
              <div className="sk_bg w-full h-2"></div>
              <div className="sk_bg w-full h-2"></div>
              <div className="sk_bg w-full h-2"></div>
              <div className="sk_bg w-full h-2"></div>
              <div className="sk_bg w-full h-2"></div>
              <div className="sk_bg w-full h-2"></div>
              <div className="sk_bg w-full h-2"></div>
              <div className="sk_bg w-full h-2"></div>
              <div className="sk_bg w-full h-2"></div>
              <div className="sk_bg w-full h-2"></div>
              <div className="sk_bg w-full h-2"></div>
              <div className="sk_bg w-full h-2"></div>
              <div className="sk_bg w-full h-2"></div>
            </div>
          </div>
          <div className="rs-details grid gap-5">
            <div>
              <div className="sk_bg w-full max-w-[3em] h-2"></div>
              <div className="sk_bg w-full max-w-[10em] mt-2 h-3"></div>
            </div>
            <div>
              <div className="sk_bg w-full max-w-[3em] h-2"></div>
              <div className="sk_bg w-full max-w-[10em] mt-2 h-3"></div>
            </div>
            <div>
              <div className="sk_bg w-full max-w-[3em] h-2"></div>
              <div className="sk_bg w-full max-w-[10em] mt-2 h-3"></div>
            </div>
          </div>
          <div className="rs-researchers">
            <div className="sk_bg w-full max-w-[3em] h-2"></div>
            <div className="pl-5">
              <ul className="list-disc">
                <div className="sk_bg w-full max-w-[10em] mt-2 h-3"></div>
                <div className="sk_bg w-full max-w-[10em] mt-2 h-3"></div>
                <div className="sk_bg w-full max-w-[10em] mt-2 h-3"></div>
                <div className="sk_bg w-full max-w-[10em] mt-2 h-3"></div>
              </ul>
            </div>
          </div>
          <div className="rs-abstract justify-self-center text-justify leading-10 w-full">
            <div className="max-w-xl grid gap-5">
              <div className="sk_bg w-full max-w-[7em] mx-auto h-3 mt-5"></div>
              <div className="sk_bg w-full max-w-md h-3 place-self-end"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
              <div className="sk_bg w-full h-3"></div>
            </div>
          </div>
          <div className="rs-button grid place-items-end md:place-items-start">
            <Divider />
            <PriButton loading>Download</PriButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default ThesisItemsView;
