import { Typography, Row, Divider, Button, Modal, Form, Input } from "antd";
import React, { useState } from "react";

const { Title, Paragraph } = Typography;

const styles = {
  title: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#53326",
    marginBottom: "16px",
  },

  paragraph: {
    fontSize: "14px",
    color: "black",
    marginBottom: "32px",
    maxWidth: "600px",
  },

  contactbutton: {
    alignitems: "flex",
    margin: "20px",
    background: "aqua",
    marginRight: "40px",
    display: "flex",
    marginLeft: "auto",
  },
};

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
    console.log("Received values of form: ", values);
  };

  return (
    <>
      <Button type="primary" onClick={showModal} style={styles.contactbutton}>
        Contact Us
      </Button>
      <Modal
        title="Contact Us"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form name="contact" onFinish={onFinish}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="message"
            rules={[{ required: true, message: "Please enter your message" }]}
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
};

const AboutUs = () => {
  return (
    <section className="relative md:pt-20">
      <header>
        <Title className="text-center" level={4} style={styles.title}>
          About Us
        </Title>
      </header>
      <Row gutter={[16, 16]} justify="center">
        <Paragraph style={styles.paragraph}>
          <p>
            Welcome to our Thesis Abstract Management System for the College of
            Engineering in Morong Rizal! We are a team of undergraduate computer
            engineering students from the University of Rizal System in Morong
            Rizal, Philippines. Our goal is to provide a user-friendly and
            efficient system for managing thesis abstract submissions for the
            College of Engineering.
          </p>
          <p>
            Our mission is to streamline the thesis submission process for
            students and faculty. We understand that submitting a thesis can be
            a daunting and time-consuming task, which is why we developed our
            Thesis Abstract Management System to simplify the process and reduce
            errors.
          </p>
          <p>
            The development of our Thesis Abstract Management System began as a
            response to the challenges faced by students and faculty in managing
            thesis abstract submissions. We are proud to have achieved several
            milestones along the way, including the successful completion of the
            system's prototype and beta testing.
          </p>
          <p>
            Our team is composed of dedicated computer engineering students with
            expertise in software development and programming. We are passionate
            about creating innovative solutions to complex problems.
          </p>
          <p>
            Our system's key features include a user-friendly interface, an
            easy-to-use submission process, and a real-time tracking system.
            These features allow students and faculty to submit and manage their
            thesis abstracts with ease and transparency.
          </p>
          <p>
            By using our system, students and faculty will benefit from improved
            efficiency, reduced errors, and increased transparency. In addition,
            our Thesis Abstract Management System also provides a platform for
            real-time feedback and support.
          </p>
          <p>
            Don't just take our word for it, here's what some of our users have
            to say: [insert testimonials from users]
          </p>
          <p>
            If you have any questions or need technical support, please don't
            hesitate to contact our team. You can find our contact information
            on our website.
          </p>
          <p>
            We invite you to try our Thesis Abstract Management System for the
            College of Engineering in Morong Rizal. Sign up today and experience
            a streamlined and efficient thesis submission process.
          </p>
        </Paragraph>
      </Row>
      <ContactUs />
    </section>
  );
};

export default AboutUs;
