import Head from "next/head";
import Image from "next/image";
import { PriButton } from "@/components/button";
import Search from "@/components/search";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <>
      <Head>
        <title>
          Thesis Abstract Management System for College of Engineering
        </title>
        <meta
          name="description"
          content="Web based Thesis Abstract Management System for College of Engineering"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section>
        <header className="relative text-white md:grid md:grid-cols-2 place-items-center md:h-screen md:max-h-[70em]">
          <div className="flex flex-col gap-2 max-w-sm">
            <h1 className="drop-shadow-lg">
              Thesis Abstract Management System for College of Engineering
            </h1>
            <div className="text-white/80 drop-shadow-lg">
              Find related Ideas for your projects
              <Search />
            </div>
            <div>
              <PriButton size="large">Get Started</PriButton>
            </div>
          </div>
          <div className="relative md:min-w-[50em] w-full h-[25em] md:w-full md:h-3/4 md:min-h-96">
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
