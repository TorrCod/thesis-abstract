import { useEffect, useState } from "react";
import { Modal, Form, Input, Divider, Select, message } from "antd";
import { PriButton } from "./button";
import { Course, UserDetails } from "@/context/types.d";
import { auth, signIn } from "@/lib/firebase";
import useUserContext from "@/context/userContext";
import AdminProfile from "./admin";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import useGlobalContext, { LoadingGlobal } from "@/context/globalContext";
import { useRouter } from "next/router";

const SignInSignUp = () => {
  const [open, setOpen] = useState(false);
  const [formSignIn] = Form.useForm();
  const userCtx = useUserContext();
  const { state, dispatch: globalDispatch } = useGlobalContext();
  const promtToSignIn = state.signIn;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (promtToSignIn) {
      setOpen(promtToSignIn);
    }
  }, [promtToSignIn]);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await formSignIn.validateFields();
      const email = formSignIn.getFieldValue("sign-in-email");
      const password = formSignIn.getFieldValue("sign-in-password");
      await signIn(email, password);
      await router.push("/dashboard/overview");
    } catch (error) {
      const errorMessage: string = (error as any).message;
      if (errorMessage) {
        message.error("User Not Found");
      }
      console.error(error);
    } finally {
      () => setLoading(false);
      setOpen(false);
      formSignIn.resetFields();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    globalDispatch({ type: "sign-in", payload: false });
  };

  const showModal = () => {
    setOpen(true);
  };

  return userCtx.state.userDetails ? (
    <AdminProfile userDetails={userCtx.state.userDetails} />
  ) : (
    <>
      <PriButton type="primary" onClick={showModal}>
        Sign In
      </PriButton>
      <Modal
        className="z-40"
        centered
        bodyStyle={{ padding: "2em" }}
        open={open}
        onCancel={handleCancel}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
      >
        <h3 className="text-center my-5 text-[#38649C]">Sign In</h3>
        <Form form={formSignIn} layout="vertical">
          <Form.Item
            name="sign-in-email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input placeholder="Email" type="email" />
          </Form.Item>
          <Form.Item
            name="sign-in-password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Link onClick={() => setOpen(false)} href="/forgot-password">
            forgot password?
          </Link>
          <Form.Item className="grid place-items-end">
            <PriButton
              loading={loading}
              htmlType="submit"
              onClick={handleSignIn}
            >
              Sign In
            </PriButton>
          </Form.Item>
        </Form>
        <Divider />
        <div className="text-center opacity-80">
          This Feature is for admin only
        </div>
      </Modal>
    </>
  );
};

export default SignInSignUp;
