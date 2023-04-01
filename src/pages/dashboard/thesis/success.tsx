import { PriButton } from "@/components/button";
import DashboardLayout from "@/components/dashboardLayout";
import { NextPageWithLayout } from "@/pages/_app";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Space } from "antd";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { getCsrfToken } from "next-auth/react";
import Link from "next/link";
import React, { ReactElement } from "react";
import { BsFillSendCheckFill } from "react-icons/bs";

const Page: NextPageWithLayout = () => {
  return (
    <>
      <div className="opacity-80 mb-3">
        <Link href="/dashboard/overview">Dashboard</Link> {">"}
        <Link href="/dashboard/thesis">Thesis</Link> {">"} Upload
      </div>
      <div className="bg-white rounded-md shadow-md p-5 md:p-10 mb-20 relative pb-20 md:grid gap-x-20 max-w-xl m-auto text-center place-items-center gap-5">
        <BsFillSendCheckFill size={"3em"} />
        <h3>Abstract is uploaded successfully</h3>
        <Space>
          <Link href="/dashboard/overview">
            <PriButton>Back to Dashboard</PriButton>
          </Link>
          <Link href="/dashboard/thesis/upload-thesis">
            <PriButton>Upload Again</PriButton>
          </Link>
        </Space>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  const csrfToken = await getCsrfToken({ req });
  if (!session)
    return {
      redirect: { destination: "/?sign-in" },
      props: { data: [] },
    };
  if (!csrfToken) return { notFound: true };
  return {
    props: {
      data: [],
    },
  };
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Page;
