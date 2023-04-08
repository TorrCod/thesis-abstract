import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Pagination, PaginationProps, Timeline, TimelineItemProps } from "antd";
import DashboardLayout from "@/components/dashboardLayout";
import useUserContext from "@/context/userContext";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { getCsrfToken } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import { readActivityLogReason } from "@/utils/helper";
import { NextPageWithLayout } from "../_app";
import useGlobalContext from "@/context/globalContext";
import useOnScreen from "@/hook/useOnScreen";
import { getActivityLog } from "@/utils/account-utils";
import { auth } from "@/lib/firebase";
import { ActivityLog } from "@/context/types.d";

const Page: NextPageWithLayout = () => {
  const {
    state: userState,
    loadActivityLog,
    dispatch,
    addActivityLog,
  } = useUserContext();
  const { updateSearchAction, state: globalState } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isOnScreen = useOnScreen<HTMLDivElement | null>(bottomRef);
  const [isAllData, setIsAllData] = useState(false);
  const [newActivityLog, setNewActivityLog] = useState<ActivityLog[]>([]);
  const pageNo = useRef(1);

  useEffect(() => {
    const fetchData = async () => {
      const token = await auth.currentUser?.getIdToken();
      pageNo.current += 1;
      const activityLog = await getActivityLog(
        token,
        undefined,
        undefined,
        pageNo.current,
        5
      );
      if (activityLog.document.length) {
        setNewActivityLog(activityLog.document);
      }
    };
    if (isOnScreen && !isAllData && userState.userDetails) {
      fetchData();
    }
  }, [isOnScreen, isAllData, userState.userDetails]);

  useEffect(() => {
    if (newActivityLog.length) {
      addActivityLog(newActivityLog);
    }
  }, [newActivityLog]);

  useEffect(() => {
    return () => updateSearchAction().clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange: PaginationProps["onChange"] = async (pageNo) => {
    setLoading(true);
    const searchAction = { ...globalState.searchingAction, pageNo };
    updateSearchAction().update(searchAction);
    loadActivityLog(undefined, searchAction.pageNo);
  };

  return (
    <>
      <div className="opacity-80 mb-3">Dashboard {">"} Activity Log</div>
      <div className="bg-white rounded-md p-5 grid gap-2 overflow-hidden">
        <p className="opacity-60 mb-5">History</p>
        <div className="md:-translate-x-40 lg:-translate-x-60">
          <ActivityTimeline />
        </div>
        <div ref={bottomRef} />
        {/* <Pagination
          className="place-self-end"
          current={globalState.searchingAction.pageNo ?? 1}
          total={userState.activityLog.totalCount}
          onChange={handlePageChange}
        /> */}
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Page;

export const ActivityTimeline = () => {
  const [log, setLog] = useState<TimelineItemProps[]>([]);
  const userCtx = useUserContext();
  const { activityLog } = userCtx.state;

  useEffect(() => {
    const newLog = activityLog.document.map((item) => {
      const readedItem = readActivityLogReason(item);
      return {
        label: new Date(item.date).toLocaleString(),
        children: <div>{readedItem?.reason}</div>,
        dot: readedItem?.dot,
        color: readedItem?.color,
      };
    });
    const newLogFiltered = newLog.filter(async (item) => item !== null);
    setLog(newLogFiltered as any);
  }, [activityLog]);

  return <Timeline mode="left" items={log} />;
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
