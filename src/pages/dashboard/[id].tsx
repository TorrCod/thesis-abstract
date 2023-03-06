import { PriButton } from "@/components/button";
import Search from "@/components/search";
import { ThesisItems } from "@/context/types.d";
import { Divider } from "antd";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { generateId, getData } from "@/lib/mongo";
import Dashboard from "@/components/dashboard";
import DashboardOverview from "@/components/dashboardOverview";

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await getData("accounts", "user");
  const userList = generateId(res);
  const itemId = context.params?.id;
  const foundItem = userList.find((item) => itemId === item["id"]);
  if (!foundItem) {
    return {
      props: { hasError: true },
    };
  }
  return {
    props: { data: foundItem },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await getData("accounts", "user");
  const users = generateId(res);
  const pathWithParams = users.map((item) => ({
    params: { id: item.id },
  }));

  return {
    paths: pathWithParams,
    fallback: true,
  };
};

const DasboardView = (props: { data: ThesisItems; hasError: boolean }) => {
  const router = useRouter();
  if (props.hasError) {
    return <h1>Error - please try another parameter</h1>;
  }
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <Dashboard userSelectedMenu="/dashboard">
      <DashboardOverview />
    </Dashboard>
  );
};

export default DasboardView;
