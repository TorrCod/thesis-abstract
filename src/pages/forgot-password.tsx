import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { PriButton } from "@/components/button";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      // Handle forgot password logic here
      await sendPasswordResetEmail(auth, values.email);
      console.log("Forgot password form submitted with values:", values);
    } catch (error) {
      message.error("Email not found");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="md:py-20">
      <div className="bg-white p-5 rounded-md max-w-lg m-auto">
        <h3 className="mb-5">Send a password reset email</h3>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                message: "Please enter a valid email address",
              },
              {
                required: true,
                message: "Please enter your email address",
              },
            ]}
          >
            <Input placeholder="Enter your email address" />
          </Form.Item>
          <Form.Item className="grid place-content-end">
            <PriButton type="primary" htmlType="submit" loading={loading}>
              Send
            </PriButton>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default ForgotPassword;
