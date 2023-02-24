import Head from "next/head";
import Image from "next/image";
import SearchBar from "@/components/searchbar";
import { PriButton } from "@/components/button";

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
        <header className="relative text-white grid md:grid-cols-2 md:place-items-center md:h-screen md:overflow-hidden">
          <div className="flex flex-col gap-2 max-w-sm">
            <h1>
              Thesis Abstract Management System for College of Engineering
            </h1>
            <div className="text-white/80">
              Find related Ideas for your projects
              <SearchBar />
            </div>
            <div>
              <PriButton size="large">Get Started</PriButton>
            </div>
          </div>
          <div>
            <Image
              src="/PC.png"
              alt="background"
              height={1000}
              width={1000}
              style={{ objectFit: "cover" }}
            />
          </div>
        </header>
      </main>
    </>
  );
}
