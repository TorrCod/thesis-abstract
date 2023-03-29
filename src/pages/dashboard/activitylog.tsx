import React, { useEffect, useRef, useState } from "react";
import { Timeline, TimelineItemProps } from "antd";
import DashboardLayout from "@/components/dashboardLayout";
import useUserContext from "@/context/userContext";
import { MdRemove, MdRestore } from "react-icons/md";
import Link from "next/link";
import { BsBookmarkPlus, BsBookmarkX } from "react-icons/bs";
import { RiMailAddLine } from "react-icons/ri";
import { HiOutlineUser, HiOutlineUserMinus } from "react-icons/hi2";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { getCsrfToken } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getUserDetails } from "@/utils/account-utils";
import { readActivityLogReason } from "@/utils/helper";
import { auth } from "@/lib/firebase";

const ActivityLog = () => {
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/activitylog"
    >
      <div className="opacity-80 mb-3">Dashboard {">"} Activity Log</div>
      <div className="bg-white rounded-md p-5 grid gap-2 overflow-hidden">
        <p className="opacity-60 mb-5">History</p>
        <div className="md:-translate-x-40 lg:-translate-x-60">
          <ActivityTimeline />
        </div>
      </div>
    </DashboardLayout>
  );
};

export const ActivityTimeline = ({ userId }: { userId?: string }) => {
  const [log, setLog] = useState<TimelineItemProps[]>([]);
  const userCtx = useUserContext();
  const { activityLog } = userCtx.state;
  const { loadActivityLog } = userCtx;
  const runOnece = useRef(false);

  useEffect(() => {
    if (userCtx.state.userDetails && !activityLog.length && !runOnece.current) {
      loadActivityLog();
      runOnece.current = true;
    }
  }, [userCtx.state.userDetails, activityLog]);

  useEffect(() => {
    const load = async () => {
      const newLog = activityLog.map((item) => {
        const setData = () => {
          const readedItem = readActivityLogReason(item);
          return {
            label: new Date(item.date).toLocaleString(),
            children: <div>{readedItem?.reason}</div>,
            dot: readedItem?.dot,
            color: readedItem?.color,
          };
        };

        if (!userId || userId === item.userId) {
          return setData();
        }

        return null; // <-- Add a return statement outside the if statement to return a value in case the condition is not met
      });
      const newLogFiltered = newLog.filter(async (item) => item !== null);
      setLog(newLogFiltered as any);
    };
    load();
    return () => setLog([]);
  }, [activityLog, userId]);

  return <Timeline reverse mode="left" items={log} />;
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

export default ActivityLog;
