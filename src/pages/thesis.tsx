import Search from "@/components/search";
import { ThesisItems, ThesisState } from "@/context/types.d";
import { Divider } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import useGlobalContext from "@/context/globalContext";
import { useRouter } from "next/router";
import { getAllThesis } from "@/utils/thesis-item-utils";

const Thesis = () => {
  const { state: globalState, loadingState } = useGlobalContext();
  const [thesisItems, setThesisItems] = useState<ThesisState>({
    document: [],
    totalPage: 1,
    currentPage: 1,
  });
  const router = useRouter();

  useEffect(() => {
    loadingState.add("/thesis");
    const title = router.query.title as string | undefined;
    const course =
      router.query.course && JSON.parse(router.query.course as string);
    const year = router.query.year && JSON.parse(router.query.year as string);
    getAllThesis({ title, course, year }, { limit: 10 })
      .then((res) => {
        setThesisItems(res);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => loadingState.remove("/thesis"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

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
        <div className="md:pt-20 md:flex md:place-items-center md:flex-col mb-10">
          <div className="grid w-full relative">
            <Search
              showFilter={true}
              className="place-self-center my-5 w-full max-w-3xl z-10 absolute top-0"
            />
            <Divider className="bg-white/30 mt-32" />
          </div>
          <div className="grid gap-2 w-full place-items-center lg:grid-cols-2 relative md:px-5">
            {globalState.loading.includes("/thesis") ? (
              <>
                <ItemsLoading />
                <ItemsLoading />
                <ItemsLoading />
                <ItemsLoading />
                <ItemsLoading />
                <ItemsLoading />
              </>
            ) : (
              thesisItems.document?.map((thesisItem) => {
                return <Items key={thesisItem._id} {...thesisItem} />;
              })
            )}
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
          <span className="text-sm text-[#38649C]">Title</span>
          <Link
            className="hover:text-sky-700 hover:underline hover:decoration-1"
            href={`/thesis/${_id}`}
          >
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
      <div className="div1 p-3 bg-white shadow-md rounded-sm h-52 overflow-h_idden text-[0.7em] relative text-justify justify-self-center leading-4 w-full">
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

const ItemsLoading = () => {
  return (
    <div className="thesis_items w-full bg-slate-100 max-w-[50em] shadow-md rounded-md p-5 grid h-full gap-5">
      <div className="div2 flex flex-col gap-5">
        <div className="grid gap-2 max-w-xs">
          <div className="w-1/4 h-2 sk_bg"></div>
          <h2 className="w-full h-3 sk_bg"></h2>
          <h2 className="w-1/2 h-3 sk_bg"></h2>
        </div>
        <div className="grid gap-2 max-w-xs">
          <div className="w-1/4 h-2 sk_bg"></div>
          <h2 className="w-1/2 h-3 sk_bg"></h2>
        </div>
        <div className="grid gap-2 max-w-xs">
          <div className="w-1/4 h-2 sk_bg"></div>
          <h2 className="w-1/2 h-3 sk_bg"></h2>
        </div>
      </div>
      <div className="div3 grid gap-2 max-w-xs">
        <div className="w-1/4 h-2 sk_bg"></div>
        <h2 className="w-full h-3 sk_bg"></h2>
        <h2 className="w-full h-3 sk_bg"></h2>
        <h2 className="w-full h-3 sk_bg"></h2>
        <h2 className="w-full h-3 sk_bg"></h2>
      </div>
      <div className="div1 p-3 bg-white shadow-md rounded-sm h-52 relative w-full ">
        <div className="overflow-hidden w-full grid gap-1 h-fit">
          <div className="w-1/4 h-2 sk_bg m-auto"></div>
          <div className="w-10/12 h-2 sk_bg place-self-end"></div>
          <div className="w-full h-2 sk_bg"></div>
          <div className="w-full h-2 sk_bg"></div>
          <div className="w-full h-2 sk_bg"></div>
          <div className="w-full h-2 sk_bg"></div>
          <div className="w-full h-2 sk_bg"></div>
          <div className="w-full h-2 sk_bg"></div>
          <div className="w-full h-2 sk_bg"></div>
          <div className="w-full h-2 sk_bg"></div>
          <div className="w-full h-2 sk_bg"></div>
          <div className="w-full h-2 sk_bg"></div>
          <div className="w-full h-2 sk_bg"></div>
          <div className="w-full h-2 sk_bg"></div>
          <div className="w-full h-2 sk_bg"></div>
        </div>
      </div>
    </div>
  );
};

export default Thesis;
