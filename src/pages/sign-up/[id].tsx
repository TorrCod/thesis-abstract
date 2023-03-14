import { PriButton } from "@/components/button";
import { Course, UserDetails } from "@/context/types.d";
import useUserContext from "@/context/userContext";
import useAuth from "@/hook/useAuth";
import { getData, generateId } from "@/lib/mongo";
import { removePending } from "@/utils/account";
import { Form, Input, message, Select } from "antd";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { TbLinkOff } from "react-icons/tb";

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const res = await getData("accounts", "pending");
    const emailId = generateId(res);
    const itemId = context.params?.id;
    const foundItem = emailId.find((item) => itemId === item["id"]);
    foundItem.expireAt = null;
    return {
      props: { data: foundItem },
    };
  } catch (e) {
    console.error(e);
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

const courseOpt: { value: Course; label: Course }[] = [
  { value: "Civil Engineer", label: "Civil Engineer" },
  { value: "Computer Engineer", label: "Computer Engineer" },
  { value: "Electrical Engineer", label: "Electrical Engineer" },
  { value: "Mechanical Engineer", label: "Mechanical Engineer" },
  { value: "Electronics Engineer", label: "Electronics Engineer" },
];

const HandleInviteLink = (props: {
  data: { payload: string; id: string; _id: any };
  hasError: boolean;
}) => {
  const router = useRouter();
  if (typeof window !== "undefined" && props.hasError) {
    router.push("/link-expired");
    return <></>;
  }
  if (router.isFallback) {
    return <section>Loading...</section>;
  }
  const [formSignUp] = Form.useForm();
  const userCtx = useUserContext();
  const handleSignUp = async () => {
    try {
      await formSignUp.validateFields();
      // TODO: handle sign in/signup logic
      const payload = formSignUp.getFieldsValue();
      const userDetails: UserDetails = {
        email: payload["sign-up-email"],
        userName: payload["username"],
        course: payload["course"],
        firstName: payload["firstname"],
        lastName: payload["lastname"],
        password: payload["confirm-password"],
        profilePic: undefined,
        approove: undefined,
      };
      await userCtx.userSignUp?.(userDetails);
      await removePending(props.data["_id"]);
      message.success({
        type: "success",
        content: "Initialized Successfully",
      });
      formSignUp.resetFields();
      router.push("/dashboard/overview");
    } catch (error) {
      const errmessage = (error as any).message;
      if (errmessage) {
        message.error(errmessage);
      }
      console.error(error);
    }
  };

  return (
    <section className="md:pt-20 max-w-md m-auto">
      <Form className="bg-white py-2 px-5 rounded-md" form={formSignUp}>
        <h3 className="text-center my-5 text-[#38649C]">
          Account initialization
        </h3>
        <p className="m-5">
          Before we continue we would like to know more about you.
        </p>
        <Form.Item
          name="firstname"
          rules={[{ required: true, message: "Please enter your first name" }]}
        >
          <Input placeholder="First Name" />
        </Form.Item>
        <Form.Item
          name="lastname"
          rules={[{ required: true, message: "Please enter your last name" }]}
        >
          <Input placeholder="Last name" />
        </Form.Item>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please enter your Username" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="sign-up-email"
          rules={[
            { required: true, message: "Please enter your email" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || props.data.payload === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Please use the email address that we sent the link to"
                  )
                );
              },
            }),
          ]}
        >
          <Input type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="course"
          rules={[{ required: true, message: "Please enter your course" }]}
        >
          <Select
            style={{ width: "13em", textAlign: "center" }}
            placeholder="Course"
            options={courseOpt}
          />
        </Form.Item>
        <Form.Item
          name="sign-up-password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="confirm-password"
          dependencies={["sign-up-password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("sign-up-password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>
        <Form.Item className="grid place-items-end">
          <PriButton htmlType="submit" onClick={handleSignUp}>
            Initialize
          </PriButton>
        </Form.Item>
      </Form>
    </section>
  );
};

export default HandleInviteLink;
