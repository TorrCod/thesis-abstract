import { PriButton } from "@/components/button";
import { Avatar, Card, Divider, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import Image from "next/image";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";

const AboutUs = () => {
  return (
    <>
      <section>
        <div className="text-white">
          <div className="relative h-[15em] w-3/4 m-auto ">
            <Image
              style={{ objectFit: "cover" }}
              src={"/book.svg"}
              alt="book"
              fill
            />
          </div>
          <h1 className="text-center my-4" style={{ fontSize: "1.4rem" }}>
            THESIS ABSTRACT MANAGEMENT SYSTEM FOR COLLEGE OF ENGINEERING
          </h1>
          <p className="opacity-80 text-center">
            Welcome to our Thesis Abstract Management System for the College of
            Engineering in Morong Rizal! We are a team of undergraduate computer
            engineering students from the University of Rizal System in Morong
            Rizal, Philippines.
          </p>
        </div>
        <div className="pt-32">
          <div className="relative h-[15em] w-3/4 m-auto">
            <Image
              style={{ objectFit: "contain" }}
              src={"/goals.svg"}
              alt="goal"
              fill
            />
          </div>
          <h1 className="text-center my-4 opacity-80">
            WHAT GOALS WE INTENDED TO DO?
          </h1>
          <p className="opacity-80 text-center">
            Our mission is to streamline the thesis submission process for
            students and faculty. We understand that submitting a thesis can be
            a daunting and timeconsuming task, which is why we developed our
            Thesis Abstract Management System to simplify the process and reduce
            errors.
          </p>
        </div>
        <div className="pt-32">
          <div className="relative h-[15em] w-3/4 m-auto">
            <Image
              style={{ objectFit: "cover" }}
              src={"/puzzle.svg"}
              alt="puzzle"
              fill
            />
          </div>
          <h1 className="opacity-80 text-center py-5">TENACITY</h1>
          <p className="opacity-80 text-center">
            The development of our Thesis Abstract Management System began as a
            response to the challenges faced by students and faculty in managing
            thesis abstract submissions. We are proud to have achieved several
            milestones along the way, including the successful completion of the
            system's prototype and beta testing.
          </p>
        </div>
        <div className="pt-32">
          <div className="bg-slate-100 shadow-md p-5 rounded-lg m-5 text-justify">
            By using our system, students and faculty will benefit from improved
            efficiency, reduced errors, and increased transparency. In addition,
            our Thesis Abstract Management System also provides a platform for
            real-time feedback and support.
          </div>
          <div className="bg-slate-100 shadow-md p-5 rounded-lg m-5 text-justify">
            Our system's key features include a userfriendly interface, an
            easy-to-use submission process, and a real-time tracking system.
            These features allow students and faculty to submit and manage their
            thesis abstracts with ease and transparency.
          </div>
        </div>
        <div className="pt-32">
          <div className="p-5">
            <h1 className="my-4 opacity-80">GET IN TOUCH</h1>
            <p className="opacity-80">
              If you have any questions or need technical support, please don't
              hesitate to contact our team. You can find our contact information
              on our website.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 mt-5">
                <AiOutlinePhone color="#38649C" size={"1.5em"} />
                torreschristian@gmail.com
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineMail color="#38649C" size={"1.5em"} />
                09683680391
              </div>
              <div className="flex items-center gap-3">
                <CiLocationOn color="#38649C" size={"1.5em"} />
                URS MORONG
              </div>
            </div>
          </div>
          <div className="bg-slate-100 mx-5 shadow-md rounded-xl p-5">
            <h3 className="py-5 opacity-80">Direct Message</h3>
            <Form>
              <Form.Item>
                <Input placeholder="name" />
              </Form.Item>
              <Form.Item>
                <Input placeholder="email" />
              </Form.Item>
              <Form.Item>
                <TextArea autoSize={{ minRows: 8 }} placeholder="message... " />
              </Form.Item>
              <Form.Item>
                <PriButton>SEND</PriButton>
              </Form.Item>
            </Form>
          </div>
        </div>
      </section>
      <div className="mt-32 bg-[#38649C] relative text-white p-2">
        <h1 className="text-center py-10 opacity-80">RESEARCHER</h1>
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col place-items-center">
            <Avatar size={"large"} />
            <div>Christian Bert Torres</div>
          </div>
          <div className="flex flex-col place-items-center">
            <Avatar size={"large"} />
            <div>Christian Bert Torres</div>
          </div>
          <div className="flex flex-col place-items-center">
            <Avatar size={"large"} />
            <div>Christian Bert Torres</div>
          </div>
          <div className="flex flex-col place-items-center">
            <Avatar size={"large"} />
            <div>Christian Bert Torres</div>
          </div>
        </div>
        <p className="text-center py-10 opacity-80">
          Our team is composed of dedicated computer engineering students with
          expertise in software development and programming. We are passionate
          about creating innovative solutions to complex problems.
        </p>
      </div>
    </>
  );
};

export default AboutUs;
