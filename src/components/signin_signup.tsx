import { useState } from "react";
import { Modal, Form, Input, Divider, Select, message } from "antd";
import { PriButton } from "./button";
import { Course } from "@/context/types.d";

const SignInSignUp = () => {
  const [open, setOpen] = useState(false);
  const [formSignIn] = Form.useForm();
  const [formSignUp] = Form.useForm();

  const handleSignIn = async () => {
    try {
      await formSignIn.validateFields();
      // TODO: handle sign in/signup logic
      setOpen(false); // close the modal after successful sign in/signup
      formSignUp.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignUp = async () => {
    try {
      await formSignUp.validateFields();
      // TODO: handle sign in/signup logic
      setOpen(false); // close the modal after successful sign in/signup
      formSignUp.resetFields();
      message.success({
        type: 'success',
        content: 'Registered Successfully! Please wait for the admins approval.',
      });
    } catch (error) {
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
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input placeholder="Email" type="email" />
          </Form.Item>
          <Form.Item
            name="password"
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
            name="firstName"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="signupEmail"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="course"
            rules={[{ required: true, message: "Please enter your course" }]}
          >
            <Select
              style={{ width: "fit-content" }}
              placeholder="Course"
              options={courseOpt}
            />
          </Form.Item>
          <Form.Item
            name="signupPassword"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["signupPassword"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("signupPassword") === value) {
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
