import { Typography, Row, Divider, Button, Modal, Form, Input } from 'antd';
import React, { useState } from 'react';

const { Title, Paragraph } = Typography;

const styles = {

  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
    marginTop: '50px',
  },

  paragraph: {
    fontSize: '24px',
    color: '#666',
    marginBottom: '32px',
    maxWidth: '600px',
  },

}


interface FormValues {
  name: string;
  email: string;
  message: string;
}

const ContactUs = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values: FormValues) => {
    console.log('Received values of form: ', values);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Contact Us
      </Button>
      <Modal title="Contact Us" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form name="contact" onFinish={onFinish}>
          <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="message"
            rules={[{ required: true, message: 'Please enter your message' }]}
          >
            <Input.TextArea placeholder="Message" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}


const AboutUs = () => {
  return (
    <>
      <header>
        <Divider orientation="center" >
          <Title level={4} style={styles.title}>About Us</Title>
        </Divider>
      </header>
      <Row gutter={[16, 16]} justify="center">
        <Paragraph style={styles.paragraph}>
          Welcome to our Thesis Abstract Management System for the College of Engineering in Morong Rizal! We are a team of undergraduate
          computer engineering students from the University of Rizal System in Morong Rizal, Philippines. Our goal is to provide a
          user-friendly and efficient system for managing thesis abstract submissions for the College of Engineering.
        </Paragraph>
      </Row>
      <ContactUs />
    </>
  );
};

export default AboutUs;
