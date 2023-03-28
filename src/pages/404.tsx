import { PriButton } from "@/components/button";
import { Button } from "antd";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PageNotFound = () => {
  return (
    <>
      <Head>
        <title>404 not found</title>
      </Head>
      <section>
        <div className="text-center md:grid md:grid-cols-2 md:place-items-center md:h-screen max-h-[50em] max-w-3xl mx-auto">
          <div className="relative h-[20em] w-full md:col-start-2">
            <Image src="/404.svg" alt="404" fill priority />
          </div>
          <div className="md:row-start-1 md:text-left">
            <h1 className="font-semibold text-white">Page Not Found</h1>
            <p className="text-white/80 max-w-xs my-5 mx-auto">
              This page doesn&apos;t exist or was removed! We suggest you back
              to home
            </p>
            <Button
              size="large"
              className="bg-[#F8B49C] flex items-center justify-center m-auto md:m-0"
              type="primary"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default PageNotFound;
