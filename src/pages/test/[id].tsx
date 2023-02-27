import Background from "@/components/background";
import Layout from "@/components/layout";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

type ThesisItems = {
  id: string;
  content: string;
};

const dummyData: ThesisItems[] = [
  { id: "hello", content: "Hello Content" },
  { id: "hi", content: "Hi Content" },
];

export const getStaticProps: GetStaticProps = async (context) => {
  const itemId = context.params?.id;
  const foundItem = dummyData.find((item) => itemId === item.id);
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
  const pathWithParams = dummyData.map((item) => ({ params: { id: item.id } }));

  return {
    paths: pathWithParams,
    fallback: true,
  };
};

const ThesisItemsView = (props: { data: ThesisItems; hasError: boolean }) => {
  const router = useRouter();

  if (props.hasError) {
    return <h1>Error - please try another parameter</h1>;
  }

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return <main className="h-[100em]">{props.data.content}</main>;
};

export default ThesisItemsView;
