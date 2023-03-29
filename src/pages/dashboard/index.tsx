import { PriButton } from "@/components/button";
import DashboardLayout from "@/components/dashboardLayout";
import Link from "next/link";
import React from "react";
import { GoLinkExternal } from "react-icons/go";
import { ActivityTimeline } from "./activitylog";
import { AdminTable } from "./admins";
import { ThesisCharts } from "./thesis";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { getCsrfToken } from "next-auth/react";

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

const DashboardOverview = () => {
  return (
    <>
      <DashboardLayout
        userSelectedMenu="/dashboard"
        userSelectedSider="/dashboard/overview"
      >
        <div className="opacity-80 mb-3">Dashboard {">"} Overview</div>

        <div className="dashboard-overview md:gap-2 w-full grid relative gap-2">
          <div className="bg-white rounded-md shadow-md thesis grid relative content-start">
            <div className="absolute top-0 left-0 z-10">
              <Link className="grid w-fit" href={"/dashboard/thesis"}>
                <h3 className="opacity-80 mb-3 mx-5 pt-5">Thesis</h3>
                <div className="ml-6 opacity-60 flex items-center gap-2">
                  Manage Thesis Abstracts <GoLinkExternal />
                </div>
              </Link>
              <Link href={"/dashboard/thesis/upload-thesis"}>
                <PriButton className="w-fit bg-[#F8B49C] flex items-center gap-2 mx-5">
                  Upload <GoLinkExternal />
                </PriButton>
              </Link>
            </div>
            <div className="overflow-auto">
              <div className="h-96 min-w-[32em]">
                <ThesisCharts />
              </div>
            </div>
          </div>

          <div className=" admins bg-white rounded-md p-5 grid relative content-start gap-2">
            <Link className="grid w-fit" href={"/dashboard/admins"}>
              <h3 className="opacity-80 mb-3">Admins</h3>
            </Link>
            <Link href="/dashboard/admins">
              <div className="opacity-60 flex items-center gap-2 mb-5">
                Manage Co-Admins <GoLinkExternal />
              </div>
            </Link>
            <div className="overflow-auto">
              <AdminTable noAction />
            </div>
          </div>

          <div className="bg-white rounded-md p-5 flex flex-col gap-2 activitylog w-full overflow-auto">
            <Link className="w-fit" href={"/dashboard/activitylog"}>
              <h3 className="opacity-80 mb-3">Acitivity Log</h3>
              <p className="opacity-60 mb-5">History</p>
            </Link>
            <ActivityTimeline />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DashboardOverview;
