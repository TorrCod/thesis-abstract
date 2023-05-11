import { PriButton } from "@/components/button";
import DashboardLayout from "@/components/dashboardLayout";
import Link from "next/link";
import React, { ReactElement } from "react";
import { GoLinkExternal } from "react-icons/go";
import { ActivityTimeline } from "./activitylog";
import { AdminTable } from "./admins";
import { ThesisCharts } from "./thesis";
import { GetServerSideProps } from "next";
import { NextPageWithLayout } from "../_app";
import useGlobalContext from "@/context/globalContext";
import { validateSession } from "@/utils/server-utils";

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  (validateSession as any)(ctx, true);

const DashboardOverview: NextPageWithLayout = () => {
  const { state: globalState } = useGlobalContext();
  return (
    <>
      <div className="opacity-80 mb-3">Dashboard {">"} Overview</div>

      <div className="dashboard-overview md:gap-2 w-full grid relative gap-2 md:min-h-[80vh] md:max-h-[52em]">
        <div className="bg-white rounded-md shadow-md thesis grid relative content-start">
          <div className="md:absolute top-0 left-0 z-10">
            <Link className="grid w-fit" href={"/dashboard/thesis"}>
              <h3 className="opacity-80 mb-3 mx-5 pt-5">Thesis</h3>
              <div className="ml-6 opacity-60 flex items-center gap-2 hover:underline hover:decoration-1 hover:text-blue-800">
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
            <div className="opacity-60 flex items-center gap-2 mb-5 hover:underline hover:decoration-1 hover:text-blue-800">
              Manage Co-Admins <GoLinkExternal />
            </div>
          </Link>
          <div className="overflow-auto">
            <AdminTable noAction max_content={3} />
          </div>
        </div>

        <div className="bg-white rounded-md p-5 flex flex-col gap-2 activitylog w-full overflow-auto">
          <Link className="w-fit" href={"/dashboard/activitylog"}>
            <h3 className="opacity-80 mb-3">Acitivity Log</h3>
            <div className="opacity-60 flex items-center gap-2 mb-5 hover:underline hover:decoration-1 hover:text-blue-800">
              All Activitylog <GoLinkExternal />
            </div>
          </Link>
          <ActivityTimeline
            loadData
            maxSize={globalState.searchingAction.pageSize}
          />
        </div>
      </div>
    </>
  );
};

DashboardOverview.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardOverview;
