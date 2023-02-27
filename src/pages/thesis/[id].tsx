import Background from "@/components/background";
import { PriButton } from "@/components/button";
import Layout from "@/components/layout";
import Search from "@/components/search";
import useGlobalContext from "@/context/globalContext";
import { ThesisItems } from "@/context/types.d";
import { Divider } from "antd";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import thesisData from "@/data/data.json";

export const getStaticProps: GetStaticProps = async (context) => {
  const thesisItems: ThesisItems[] = thesisData as unknown as ThesisItems[];
  const itemId = context.params?.id;
  const foundItem = thesisItems.find((item) => itemId === item.id);
  if (!foundItem) {
    return {
      props: { hasError: true },
    };
  }
  return {
    props: { data: foundItem },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const thesisItems: ThesisItems[] = thesisData as unknown as ThesisItems[];
  const pathWithParams = thesisItems.map((item) => ({
    params: { id: item.id },
  }));

  return {
    paths: pathWithParams,
    fallback: true,
  };
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
    <section className="flex flex-col gap-1 md:pt-20 items-center">
      <Search />
      <Divider />
      <div className="rs-container bg-slate-100 rounded-md max-w-5xl grid p-5 gap-2 md:gap-5 w-full relative">
        <div className="rs-preview p-3 bg-white shadow-md rounded-sm h-52 overflow-hidden text-[0.1em] relative max-w-[100em] text-justify justify-self-center">
          <div className="w-full h-full overflow-hidden">
            <h3 className="text-center">Abstract</h3>
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
              {props.data.researchers.map((child) => (
                <li>{child}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rs-abstract justify-self-center text-justify leading-10">
          <div className="max-w-xl">
            <h3 className="text-center">Abstract</h3>
            <p className="indent-5">{props.data.abstract}</p>
          </div>
        </div>
        <div className="rs-button grid place-items-end md:place-items-start">
          <Divider />
          <PriButton>Download</PriButton>
        </div>
      </div>
    </section>
  );
};

export default ThesisItemsView;
