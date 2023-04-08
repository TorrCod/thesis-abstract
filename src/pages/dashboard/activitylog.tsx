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
import LoadingIcon from "@/components/loadingIcon";

const Page: NextPageWithLayout = () => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const pageNo = useRef(1);
  const {
    state: userState,
    addActivityLog,
    loadActivityLog,
  } = useUserContext();
  const { updateSearchAction, state: globalState } = useGlobalContext();
  const isOnScreen = useOnScreen<HTMLDivElement | null>(bottomRef, "200px");
  const [isFetching, setIsFetching] = useState(false);
  const [isAllData, setIsAllData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newActivityLog, setNewActivityLog] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      const token = await auth.currentUser?.getIdToken();
      pageNo.current += 1;
      const activityLog = await getActivityLog(
        token,
        undefined,
        undefined,
        pageNo.current,
        globalState.searchingAction.pageSize
      );
      if (activityLog.document.length) {
        setNewActivityLog(activityLog.document);
      }
      setIsFetching(false);
    };
    if (isOnScreen && !isAllData && userState.userDetails) {
      fetchData();
    }
  }, [
    isOnScreen,
    isAllData,
    userState.userDetails,
    globalState.searchingAction.pageSize,
  ]);

  useEffect(() => {
    if (
      userState.activityLog.document.length >=
        userState.activityLog.totalCount &&
      !userState.activityLog.document.length
    ) {
      setIsAllData(true);
    } else {
      setIsAllData(false);
    }
  }, [userState.activityLog]);

  useEffect(() => {
    if (newActivityLog.length) {
      addActivityLog(newActivityLog);
    }
  }, [newActivityLog]);

  useEffect(() => {
    if (userState.userDetails) {
      setLoading(true);
      loadActivityLog().finally(() => setLoading(false));
    }
  }, [userState.userDetails]);

  useEffect(() => {
    return () => updateSearchAction().clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="opacity-80 mb-3">Dashboard {">"} Activity Log</div>
      <div className="bg-white rounded-md p-5 grid gap-2 overflow-hidden relative">
        <p className="opacity-60 mb-5">History</p>
        {loading && (
          <div className="w-full h-full grid justify-center absolute top-0 left-0 bg-black/30 z-10">
            <LoadingIcon />
          </div>
        )}
        <div className="md:-translate-x-40 lg:-translate-x-60">
          <ActivityTimeline />
        </div>
        <div className="grid place-content-center h-5 w-full" ref={bottomRef}>
          {isFetching ? <LoadingIcon /> : <></>}
        </div>
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Page;

export const ActivityTimeline = (props: { maxSize?: number }) => {
  const [log, setLog] = useState<TimelineItemProps[]>([]);
  const userCtx = useUserContext();
  const { activityLog } = userCtx.state;

  useEffect(() => {
    const newLog = activityLog.document.slice(0, props.maxSize).map((item) => {
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
