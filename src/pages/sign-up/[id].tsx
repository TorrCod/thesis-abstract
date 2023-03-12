import useAuth from "@/hook/useAuth";
import { getData, generateId } from "@/lib/mongo";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const res = await getData("accounts", "pending");
    const emailId = generateId(res);
    const itemId = context.params?.id;
    const foundItem = emailId.find((item) => itemId === item["id"]);
    return {
      props: { data: foundItem },
    };
  } catch {
    return {
      props: { hasError: true },
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await getData("accounts", "pending");
    const thesisItems = generateId(res);
    const pathWithParams = thesisItems.map((item) => ({
      params: { id: item.id },
    }));
    return {
      paths: pathWithParams,
      fallback: true,
    };
  } catch {
    return { paths: [], fallback: true };
  }
};

const HandleInviteLink = (props: {
  data: { email: string; id: string };
  hasError: boolean;
}) => {
  const router = useRouter();
  if (props.hasError) {
    return <h1>Error - please try another parameter</h1>;
  }
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return <section>Hello</section>;
};

export default HandleInviteLink;
