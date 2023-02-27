import { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const SignInSignUp = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      await form.validateFields();
      // TODO: handle sign in/signup logic
      setOpen(false); // close the modal after successful sign in/signup
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

  const buttonStyle = {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
    color: '#fff',
    borderRadius: '4px',
    marginRight: '10px',
    marginBottom: '10px',
    fontSize: '16px',
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Sign In/Sign Up
      </Button>
      <Modal open={open} onCancel={handleCancel} footer={null}>
        <h2>Sign In/Sign Up</h2>
        <Form form={form} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button style={buttonStyle} type="primary" onClick={handleOk}>
              Sign In
            </Button>
          </Form.Item>
          <hr />
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'Please enter your first name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: 'Please enter your last name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="signupEmail"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="signupPassword"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['signupPassword']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('signupPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The two passwords do not match')
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button style={buttonStyle} type="primary" onClick={handleOk}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SignInSignUp;