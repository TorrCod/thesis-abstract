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

const ActivityLog = () => {
  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/activitylog"
    >
      <div className="opacity-80 mb-3">Dashboard {">"} Activity Log</div>
      <div className="bg-white rounded-md p-5 flex flex-col gap-2">
        <p className="opacity-60 mb-5">History</p>
        <ActivityTimeline />
      </div>
    </DashboardLayout>
  );
};

export const ActivityTimeline = ({ username }: { username?: string }) => {
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
          let dot = undefined;
          let color = undefined;
          let reason = <></>;

          switch (item.reason) {
            case "invited an admin": {
              dot = (
                <div className="bg-[#f0c11a] rounded-full p-[3px]">
                  <RiMailAddLine />
                </div>
              );
              color = "white";
              reason = (
                <Link href={`/dashboard/admins?_id=${item.data.itemId}`}>
                  {item.userName} {item.reason} ({item.data.name})
                </Link>
              );
              break; // <-- Add break statements for each case
            }
            case "accepted the invite": {
              dot = (
                <div className="bg-[#29de18] rounded-full p-[3px]">
                  <HiOutlineUser />
                </div>
              );
              color = "white";
              reason = (
                <Link href={`/dashboard/admins?_id=${item.data.itemId}`}>
                  {item.userName} {item.reason} ({item.data.name})
                </Link>
              );
              break;
            }
            case "removed an admin": {
              dot = (
                <div className="bg-[#f54242] rounded-full p-[3px]">
                  <HiOutlineUserMinus />
                </div>
              );
              color = "white";
              reason = (
                <Link href={`/dashboard/admins?_id=${item.data.itemId}`}>
                  {item.userName} {item.reason} ({item.data.name})
                </Link>
              );
              break;
            }
            case "removed an invite": {
              dot = (
                <div className="bg-[#f54242] rounded-full p-[3px]">
                  <MdRemove />
                </div>
              );
              color = "white";
              reason = (
                <div>
                  {item.userName} {item.reason} ({item.data.name})
                </div>
              );
              break;
            }
            case "added a thesis": {
              dot = (
                <div className="bg-[#4287f5] rounded-full p-[3px]">
                  <BsBookmarkPlus />
                </div>
              );
              color = "white";
              reason = (
                <Link href={`/thesis/${item.data.itemId}`}>
                  {item.userName} {item.reason} ({item.data.name})
                </Link>
              );
              break;
            }
            case "removed a thesis": {
              dot = (
                <div className="bg-[#f54242] rounded-full p-[3px]">
                  <BsBookmarkX />
                </div>
              );
              color = "white";
              reason = (
                <Link
                  href={`/dashboard/thesis?tab=recyclebin&_id=${item.data.itemId}`}
                >
                  {item.userName} {item.reason} ({item.data.name})
                </Link>
              );
              break;
            }
            case "restored a thesis": {
              dot = (
                <div className="bg-[#4287f5] rounded-full p-[3px]">
                  <MdRestore />
                </div>
              );
              color = "white";
              reason = (
                <Link href={`/thesis/${item.data.itemId}`}>
                  {item.userName} {item.reason} ({item.data.name})
                </Link>
              );
              break;
            }
            default: {
              return null; // <-- Add a default case that returns a default value
            }
          }

          return {
            label: new Date(item.date).toLocaleString(),
            children: <div>{reason}</div>,
            dot: dot,
            color: color,
          };
        };

        if (!username || username === item.userName) {
          return setData();
        }

        return null; // <-- Add a return statement outside the if statement to return a value in case the condition is not met
      });
      const newLogFiltered = newLog.filter((item) => item !== null);
      setLog(newLogFiltered as any);
    };
    load();
    return () => setLog([]);
  }, [activityLog, username]);

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
