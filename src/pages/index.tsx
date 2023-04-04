import Head from "next/head";
import Image from "next/image";
import { PriButton } from "@/components/button";
import Search from "@/components/search";
import { useEffect } from "react";
import useGlobalContext from "@/context/globalContext";
import { useRouter } from "next/router";
import { Button } from "antd";

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
              Find related Ideas for your projects Hello World
              <div className="absolute w-[97vw] md:w-full lg:w-[35em]">
                <Search className="w-full" limit={5} />
              </div>
            </div>
            <div className="z-[1] mt-12">
              <Button className="bg-[#f8b49c]" type="primary" size="large">
                Get Started
              </Button>
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
