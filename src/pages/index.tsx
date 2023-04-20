import Head from "next/head";
import Image from "next/image";
import { PriButton } from "@/components/button";
import Search from "@/components/search";
import { useEffect } from "react";
import useGlobalContext from "@/context/globalContext";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const { promptToSignIn } = useGlobalContext();
  const router = useRouter();
  useEffect(() => {
    if (Object.keys(router.query).includes("signin")) {
      promptToSignIn();
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <>
      <Head>
        <title>
          Thesis Abstract Management System for College of Engineering
        </title>
      </Head>
      <section>
        <header className="relative text-white md:grid md:grid-cols-2 place-items-center md:h-screen md:max-h-[70em]">
          <div className="flex flex-col gap-2 max-w-sm">
            <h1 className="drop-shadow-lg">
              Thesis Abstract Management System for College of Engineering
            </h1>
            <div className="text-white/80 drop-shadow-lg relative z-10">
              Find related Ideas for your projects
              <div className="absolute w-[97vw] md:w-full lg:w-[35em]">
                <Search className="w-full" limit={5} />
              </div>
            </div>
            <div className="z-[1] mt-12">
              <Link href="/GetStarted">
                <PriButton size="large">Get Started</PriButton>
              </Link>
            </div>
          </div>
          <div className="relative md:min-w-[50em] w-full h-[25em] md:w-full md:h-3/4 md:min-h-96 -z-10">
            <Image
              priority={true}
              className="object-cover md:object-contain"
              src="/PC.png"
              alt="background"
              placeholder="blur"
              blurDataURL={"/PC.png"}
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
              fill
            />
          </div>
        </header>
      </section>
    </>
  );
}
import { GetServerSideProps } from "next";
import { getData } from "@/lib/mongo";
import { adminUploadFile } from "@/lib/firebase-admin";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const thesisAbstract = (await getData(
    "thesis-abstract",
    "thesis-items",
    undefined,
    { projection: { abstract: 1, id: 1 } }
  )) as unknown as { id: string; abstract: string[] }[];

  const response: any[] = [];

  for (const thesisItem of thesisAbstract) {
    thesisItem.abstract.forEach((_, index) => {
      const destination = `${thesisItem.id}/${index}`;
      const filePath = `../storage/thesis-abstract-account.appspot.com/abstract/${destination}`;
      adminUploadFile(filePath, destination)
        .then((res) => {
          response.push(res);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }

  const destination = `abstract/${thesisAbstract[0].id}/0`;
  const filePath = `../storage/thesis-abstract-account.appspot.com/${destination}`;
  await adminUploadFile(filePath, destination).catch((error) => {
    console.error(error);
  });

  return {
    props: { data: JSON.stringify(response) },
  };
};

//http://localhost:9199/v0/b/thesis-abstract-account.appspot.com/o/abstract%2F643bac4f3db9712e40639e10%2F2?alt=media&token=8715e31c-ad53-467f-916f-c38f25f71d35
