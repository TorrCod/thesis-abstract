import Head from "next/head";
import Image from "next/image";
import { PriButton } from "@/components/button";
import Search from "@/components/search";

export default function Home() {
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
      <main>
        <header className="relative text-white grid md:grid-cols-2 place-items-center md:h-screen">
          <div className="flex flex-col gap-2 max-w-sm">
            <h1>
              Thesis Abstract Management System for College of Engineering
            </h1>
            <div className="text-white/80">
              Find related Ideas for your projects
              <Search />
            </div>
            <div>
              <PriButton size="large">Get Started</PriButton>
            </div>
          </div>
          <div className="relative w-full h-[25em] md:w-full md:h-3/4 md:min-h-96">
            <Image
              className="object-cover md:object-contain"
              src="/PC.png"
              alt="background"
              fill
              style={{
                overflow: "visible",
              }}
            />
          </div>
        </header>
      </main>
    </>
  );
}
