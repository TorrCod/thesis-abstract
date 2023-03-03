import { PriButton } from "@/components/button";
import { Avatar, Card, Divider, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import Image from "next/image";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";

const AboutUs = () => {
  return (
    <section>
      <div>
        <div className="relative h-[15em] w-3/4 m-auto">
          <Image
            style={{ objectFit: "cover" }}
            src={"/book.svg"}
            alt="book"
            fill
          />
        </div>
        <h1 className="text-center text-lg">
          THESIS ABSTRACT MANAGEMENT SYSTEM FOR COLLEGE OF ENGINEERING
        </h1>
        <p>
          Welcome to our Thesis Abstract Management System for the College of
          Engineering in Morong Rizal! We are a team of undergraduate computer
          engineering students from the University of Rizal System in Morong
          Rizal, Philippines. Our goal is to provide a user-friendly and
          efficient system for managing thesis abstract submissions for the
          College of Engineering.
        </p>
      </div>
      <Divider />
      <div>
        <div className="relative h-[15em] w-3/4 m-auto">
          <Image
            style={{ objectFit: "cover" }}
            src={"/goals.svg"}
            alt="goal"
            fill
          />
        </div>
        <h1 className="text-center text-lg">WHAT GOALS WE INTENDED TO DO?</h1>
        <p>
          Our mission is to streamline the thesis submission process for
          students and faculty. We understand that submitting a thesis can be a
          daunting and timeconsuming task, which is why we developed our Thesis
          Abstract Management System to simplify the process and reduce errors.
        </p>
      </div>
      <Divider />
      <div>
        <div className="relative h-[15em] w-3/4 m-auto">
          <Image
            style={{ objectFit: "cover" }}
            src={"/puzzle.svg"}
            alt="puzzle"
            fill
          />
        </div>
        <p>
          Welcome to our Thesis Abstract Management System for the College of
          Engineering in Morong Rizal! We are a team of undergraduate computer
          engineering students from the University of Rizal System in Morong
          Rizal, Philippines. Our goal is to provide a user-friendly and
          efficient system for managing thesis abstract submissions for the
          College of Engineering.
        </p>
      </div>
      <Divider />
      <div>
        <div>
          By using our system, students and faculty will benefit from improved
          efficiency, reduced errors, and increased transparency. In addition,
          our Thesis Abstract Management System also provides a platform for
          real-time feedback and support.
        </div>
        <div>
          By using our system, students and faculty will benefit from improved
          efficiency, reduced errors, and increased transparency. In addition,
          our Thesis Abstract Management System also provides a platform for
          real-time feedback and support.
        </div>
      </div>
      <Divider />
      <div>
        <h1 className="text-lg">GET IN TOUCH</h1>
        <p>
          If you have any questions or need technical support, please don't
          hesitate to contact our team. You can find our contact information on
          our website.
        </p>
        <div>
          <AiOutlinePhone />
          torreschristian@gmail.com
        </div>
        <div>
          <AiOutlineMail />
          09683680391
        </div>
        <div>
          <CiLocationOn />
          URS MORONG
        </div>
        <Card title="Message Us">
          <Form>
            <Form.Item>
              <Input placeholder="name" />
            </Form.Item>
            <Form.Item>
              <Input placeholder="email" />
            </Form.Item>
            <Form.Item>
              <TextArea placeholder="message... " />
            </Form.Item>
            <Form.Item>
              <PriButton>SEND</PriButton>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <Divider />
      <div>
        <h1 className="text-center">RESEARCHER</h1>
        <div>
          <div>
            <Avatar size={"large"} />
            <div>Christian Bert Torres</div>
          </div>
          <div>
            <Avatar size={"large"} />
            <div>Christian Bert Torres</div>
          </div>
          <div>
            <Avatar size={"large"} />
            <div>Christian Bert Torres</div>
          </div>
          <div>
            <Avatar size={"large"} />
            <div>Christian Bert Torres</div>
          </div>
          <div>
            <Avatar size={"large"} />
            <div>Christian Bert Torres</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
