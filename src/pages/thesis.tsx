import Search from "@/components/search";
import { SearchQuery, ThesisItems } from "@/context/types.d";
import { ConfigProvider, Divider, Pagination } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import useGlobalContext from "@/context/globalContext";
import { useRouter } from "next/router";
import Image from "next/image";
const Thesis = () => {
  const {
    state: globalState,
    loadThesisItems,
    updateSearchAction,
    clearDefault,
  } = useGlobalContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [thesisItems, setThesisItems] = useState<ThesisItems[]>([]);

  useEffect(() => {
    return () => {
      updateSearchAction().clear();
      clearDefault();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (globalState.thesisItems.document.length) {
      const requiredValue = ["abstract", "researchers"];
      const value = Object.keys(
        globalState.thesisItems.document[0]
      ) as string[];
      const containsRequired = requiredValue.every((val) =>
        value.includes(val)
      );
      if (containsRequired) {
        setThesisItems(globalState.thesisItems.document);
      }
    }
  }, [globalState.thesisItems.document]);

  useEffect(() => {
    setLoading(true);
    const { title, course, year } = router.query as SearchQuery;
    const decodedCourse = course
      ? JSON.parse(decodeURIComponent(course as unknown as string))
      : undefined;
    const decodedYear = year
      ? JSON.parse(decodeURIComponent(year as unknown as string))
      : undefined;
    const query = { title, course: decodedCourse, year: decodedYear };
    loadThesisItems(
      query,
      {
        projection: {
          title: 1,
          course: 1,
          year: 1,
          researchers: 1,
          abstract: 1,
        },
      },
      undefined,
      1
    )
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const handlePageChange = (pageNo: number) => {
    setLoading(true);
    updateSearchAction().update({ ...globalState.searchingAction, pageNo });
    const { title, course, year } = router.query as SearchQuery;
    const decodedCourse = course
      ? JSON.parse(decodeURIComponent(course as unknown as string))
      : undefined;
    const decodedYear = year
      ? JSON.parse(decodeURIComponent(year as unknown as string))
      : undefined;
    const query = { title, course: decodedCourse, year: decodedYear };
    loadThesisItems(
      query,
      {
        projection: {
          title: 1,
          course: 1,
          year: 1,
          researchers: 1,
          abstract: 1,
        },
      },
      { ...globalState.searchingAction, pageNo }
    )
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setLoading(false));
  };

  const handleSearch = () => {
    updateSearchAction().update({ ...globalState.searchingAction, pageNo: 1 });
  };

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
              onSearch={handleSearch}
            />
            <Divider className="bg-white/30 mt-40" />
          </div>
          <ConfigProvider
            theme={{
              token: {
                colorText: "white",
                colorPrimary: "white",
                colorBgContainer: "#38649C",
                colorTextDisabled: "rgba(255,255,255,0.5)",
              },
            }}
          >
            <Pagination
              className="mb-5"
              total={globalState.thesisItems.totalCount}
              current={globalState.searchingAction.pageNo ?? 1}
              onChange={handlePageChange}
              hideOnSinglePage
              pageSize={globalState.searchingAction.pageSize}
              showSizeChanger={false}
            />
          </ConfigProvider>
          <div className="grid gap-2 w-full place-items-center md:grid-cols-2 lg:grid-cols-3 relative md:px-5">
            {loading ? (
              <>
                <ItemsLoading />
                <ItemsLoading />
                <ItemsLoading />
                <ItemsLoading />
                <ItemsLoading />
                <ItemsLoading />
              </>
            ) : (
              thesisItems.map((thesisItem) => {
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
            <h2>{title.toLocaleUpperCase()}</h2>
          </Link>
        </div>
        <div>
          <span className="text-sm text-[#38649C]">Course</span>
          <h2>{(course as string).toLocaleUpperCase()}</h2>
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
              return <li key={index}>{child.toLocaleUpperCase()}</li>;
            })}
          </ul>
        </div>
      </div>
      <Link className="div1 relative" href={`/thesis/${_id}`}>
        <div className="h-52 relative">
          <Image
            className="object-contain"
            src={abstract[0]}
            alt="abstract"
            fill
            sizes="1"
            priority
          />
        </div>
      </Link>
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
      <div className="div1 p-3 bg-white shadow-md rounded-sm h-52 relative w-3/5 m-auto sk_bg"></div>
    </div>
  );
};

export default Thesis;
