import { useState } from "react";
import { Modal, Form, Input, Divider, Select, message } from "antd";
import { PriButton } from "./button";
import { Course, UserDetails } from "@/context/types.d";
import { signUp } from "@/lib/firebase";
import useUserContext from "@/context/userContext";
// import { signIn, signUp } from "@/lib/firebase";

const SignInSignUp = () => {
  const [open, setOpen] = useState(false);
  const [formSignIn] = Form.useForm();
  const [formSignUp] = Form.useForm();
  const userCtx = useUserContext();

  const handleSignIn = async () => {
    try {
      await formSignIn.validateFields();
      const email = formSignIn.getFieldValue("email");
      const password = formSignIn.getFieldValue("password");
      // await signIn(email, password);
      setOpen(false);
      formSignIn.resetFields();
    } catch (error) {
      const errorMessage: string = (error as any).message;
      if (errorMessage) {
        message.error("User Not Found");
      }
      console.error(error);
    }
  };

  const handleSignUp = async () => {
    try {
      await formSignUp.validateFields();
      // TODO: handle sign in/signup logic
      const payload = formSignUp.getFieldsValue();
      const userDetails: UserDetails = {
        email: payload["sign-up-email"],
        password: payload["sign-up-password"],
        userName: payload["username"],
        course: payload["course"],
        firstName: payload["firstname"],
        lastName: payload["lastname"],
      };
      userCtx.userSignUp?.(userDetails);
      setOpen(false); // close the modal after successful sign in/signup
      formSignUp.resetFields();
      message.success({
        type: "success",
        content:
          "Registered Successfully! Please wait for the admins approval.",
      });
    } catch (error) {
      const errmessage = (error as any).message;
      if (errmessage) {
        message.error(errmessage);
      }
      console.error(error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
  };

  const courseOpt: { value: Course; label: Course }[] = [
    { value: "Civil Engineer", label: "Civil Engineer" },
    { value: "Computer Engineer", label: "Computer Engineer" },
    { value: "Electrical Engineer", label: "Electrical Engineer" },
    { value: "Mechanical Engineer", label: "Mechanical Engineer" },
  ];

  return (
    <>
      <PriButton type="primary" onClick={showModal}>
        Sign In/Sign Up
      </PriButton>
      <Modal
        centered
        bodyStyle={{ padding: "2em" }}
        open={open}
        onCancel={handleCancel}
        footer={null}
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
          <Form.Item className="grid place-items-end">
            <PriButton onClick={handleSignIn}>Sign In</PriButton>
          </Form.Item>
        </Form>
        <Divider />
        <Form form={formSignUp}>
          <h3 className="text-center my-5 text-[#38649C]">Sign Up</h3>
          <Form.Item
            name="firstname"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
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
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="course"
            rules={[{ required: true, message: "Please enter your course" }]}
          >
            <Select
              style={{ width: "auto", textAlign: "center" }}
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
            <PriButton onClick={handleSignUp}>Sign Up</PriButton>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SignInSignUp;
