import { PriButton } from "@/components/button";
import { LoadingGlobal } from "@/context/globalContext";
import { Course, UserDetails } from "@/context/types.d";
import useUserContext from "@/context/userContext";
import { auth } from "@/lib/firebase";
import { addUserAccount } from "@/utils/account-utils";
import { Form, Input, message, Select } from "antd";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useRouter } from "next/router";

const courseOpt: { value: Course; label: Course }[] = [
  { value: "Civil Engineer", label: "Civil Engineer" },
  { value: "Computer Engineer", label: "Computer Engineer" },
  { value: "Electrical Engineer", label: "Electrical Engineer" },
  { value: "Mechanical Engineer", label: "Mechanical Engineer" },
  { value: "Electronics Engineer", label: "Electronics Engineer" },
];
import { GetServerSideProps } from "next";
import { getOneData } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { signIn } from "next-auth/react";
import useSocketContext from "@/context/socketContext";
import { Socket, io } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@/lib/types";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const id = (ctx.params as any).id;
    const response = await getOneData("accounts", "pending", {
      _id: new ObjectId(id),
    });
    if (!response) throw new Error("no response");
    return {
      props: {
        data: {
          email: response.email,
          _id: response._id.toString(),
          approove: response.approove,
        },
      },
    };
  } catch (e) {
    console.error(e);
    return { notFound: true };
  }
};

const HandleInviteLink = (props: {
  data: { email: string; _id: string; approove: string };
  hasError: boolean;
}) => {
  const [formSignUp] = Form.useForm();
  const { unsubscribeRef, userSignUp } = useUserContext();
  const { triggerSocket } = useSocketContext();
  const handleSignUp = async () => {
    try {
      await formSignUp.validateFields();
      const payload = formSignUp.getFieldsValue();
      const userDetails: UserDetails = {
        email: payload["sign-up-email"],
        userName: payload["username"],
        course: payload["course"],
        firstName: payload["firstname"],
        lastName: payload["lastname"],
        password: payload["confirm-password"],
        dateAdded: new Date().toLocaleString(),
        profilePic: undefined,
        approove: props.data.approove,
        _id: props.data._id,
      };
      unsubscribeRef.current?.();
      await userSignUp?.(userDetails);
      const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
      socket.emit("account-update");
      socket.once("acknowledged", () => {
        socket.close();
      });
      message.success({
        type: "success",
        content: "Initialized Successfully",
      });
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
                if (!value || props.data.email === value) {
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
