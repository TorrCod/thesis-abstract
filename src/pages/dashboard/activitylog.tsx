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
import { validateSession } from "@/utils/server-utils";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newActivityLog]);

  useEffect(() => {
    if (userState.userDetails) {
      loadActivityLog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export const ActivityTimeline = (props: {
  maxSize?: number;
  loadData?: boolean;
}) => {
  const [log, setLog] = useState<TimelineItemProps[]>([]);
  const { state: userState, loadActivityLog } = useUserContext();
  const { activityLog } = userState;
  const [loading, setLoading] = useState(props.loadData);

  useEffect(() => {
    if (userState.userDetails && props.loadData) {
      loadActivityLog()
        .catch((e) => {
          console.error(e);
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState.userDetails, props.loadData]);

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
  }, [activityLog, props.maxSize]);

  return loading ? (
    <LoadingIcon className="m-auto" />
  ) : (
    <Timeline mode="left" items={log} />
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  (validateSession as any)(ctx, true);
