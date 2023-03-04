import { PriButton } from "@/components/button";
import { Avatar, Card, Divider, Form, Input } from "antd";
import Image from "next/image";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";

const AboutUs = () => {
  return (
    <>
      <section className="md:pt-40 md:grid md:place-content-center">
        <div className="text-white md:grid md:grid-cols-2 place-items-center md:h-[30em]">
          <div className="relative w-full max-w-sm h-96 md:order-2 m-auto lg:h-[30em] lg:max-w-lg">
            <Image
              style={{ objectFit: "cover" }}
              src={"/book.svg"}
              alt="book"
              fill
            />
          </div>
          <div className="md:order-1 md:p-10">
            <div className="md:max-w-[43em]">
              <h1 className="text-center md:text-left my-4 text-[1.4rem] md:text-[2rem] md:max-w-lg">
                THESIS ABSTRACT MANAGEMENT SYSTEM FOR COLLEGE OF ENGINEERING
              </h1>
              <p className="opacity-80 text-center md:text-left">
                Welcome to our Thesis Abstract Management System for the College
                of Engineering in Morong Rizal! We are a team of undergraduate
                computer engineering students from the University of Rizal
                System in Morong Rizal, Philippines.
              </p>
            </div>
          </div>
        </div>
        <div className="pt-32 md:grid md:grid-cols-2 md:place-items-center">
          <div className="relative h-80 w-full m-auto max-w-sm lg:h-[32em] lg:max-w-lg">
            <Image
              style={{ objectFit: "cover" }}
              src={"/goals.svg"}
              alt="goal"
              fill
            />
          </div>
          <div className="lg:px-20 md:p-10">
            <h1 className="text-center my-4 opacity-80 md:text-left">
              WHAT GOALS WE INTENDED TO DO?
            </h1>
            <p className="opacity-80 text-center md:text-left">
              Our mission is to streamline the thesis submission process for
              students and faculty. We understand that submitting a thesis can
              be a daunting and timeconsuming task, which is why we developed
              our Thesis Abstract Management System to simplify the process and
              reduce errors.
            </p>
          </div>
        </div>
        <div className="pt-32 md:grid md:grid-cols-2 md:place-items-center lg:h-[35em]">
          <div className="relative h-72 w-full m-auto max-w-sm lg:max-w-lg order-2 lg:h-96">
            <Image
              style={{ objectFit: "cover" }}
              src={"/puzzle.svg"}
              alt="puzzle"
              fill
            />
          </div>
          <div className="lg:px-20 order-1 md:p-10">
            <h1 className="opacity-80 text-center py-5 md:text-right">
              TENACITY
            </h1>
            <p className="opacity-80 text-center md:text-right">
              The development of our Thesis Abstract Management System began as
              a response to the challenges faced by students and faculty in
              managing thesis abstract submissions. We are proud to have
              achieved several milestones along the way, including the
              successful completion of the system's prototype and beta testing.
            </p>
          </div>
        </div>
        <div className="pt-32 md:grid md:grid-cols-2 max-w-4xl m-auto">
          <div className="bg-slate-100 shadow-md p-10 rounded-lg m-5 text-justify">
            By using our system, students and faculty will benefit from improved
            efficiency, reduced errors, and increased transparency. In addition,
            our Thesis Abstract Management System also provides a platform for
            real-time feedback and support.
          </div>
          <div className="bg-slate-100 shadow-md p-10 rounded-lg m-5 text-justify">
            Our system's key features include a userfriendly interface, an
            easy-to-use submission process, and a real-time tracking system.
            These features allow students and faculty to submit and manage their
            thesis abstracts with ease and transparency.
          </div>
        </div>
        <div className="pt-32 md:grid md:grid-cols-2 max-w-5xl m-auto gap-5">
          <div className="px-5 max-w-sm m-auto">
            <h1 className="my-4 opacity-80">GET IN TOUCH</h1>
            <p className="opacity-80 text-justify">
              If you have any questions or need technical support, please don't
              hesitate to contact our team. You can find our contact information
              on our website.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 mt-5">
                <AiOutlinePhone color="#38649C" size={"1.5em"} />
                torreschristian@gmail.com
              </div>
              <div className="flex items-center gap-3 mt-2">
                <AiOutlineMail color="#38649C" size={"1.5em"} />
                09683680391
              </div>
              <div className="flex items-center gap-3 mt-2">
                <IoLocationOutline color="#38649C" size={"1.5em"} />
                URS MORONG
              </div>
            </div>
          </div>
          <div className="grid place-content-center w-full">
            <div className="bg-slate-100 mx-5 w-full shadow-md rounded-xl p-5 max-w-sm lg:absolute md:w-full md:max-w-sm md:z-10">
              <h3 className="py-5 opacity-80">Direct Message</h3>
              <Form>
                <Form.Item>
                  <Input placeholder="name" />
                </Form.Item>
                <Form.Item>
                  <Input placeholder="email" />
                </Form.Item>
                <Form.Item>
                  <Input.TextArea
                    autoSize={{ minRows: 8 }}
                    placeholder="message... "
                  />
                </Form.Item>
                <Form.Item>
                  <PriButton>SEND</PriButton>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </section>
      <div className="mt-40">
        <div className="text-white p-2 bg-[#38649C]">
          <h1 className="text-center py-10 opacity-80">RESEARCHER</h1>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 max-w-3xl m-auto">
            <div className="flex flex-col gap-2 place-items-center">
              <Avatar className="h-28 w-28" size={"large"} />
              <div>Christian Bert Torres</div>
            </div>
            <div className="flex flex-col gap-2 place-items-center">
              <Avatar className="h-28 w-28" size={"large"} />
              <div>Christian Bert Torres</div>
            </div>
            <div className="flex flex-col gap-2 place-items-center">
              <Avatar className="h-28 w-28" size={"large"} />
              <div>Christian Bert Torres</div>
            </div>
            <div className="flex flex-col gap-2 place-items-center">
              <Avatar className="h-28 w-28" size={"large"} />
              <div>Christian Bert Torres</div>
            </div>
          </div>
          <p className="text-center py-10 opacity-80 max-w-lg m-auto">
            Our team is composed of dedicated computer engineering students with
            expertise in software development and programming. We are passionate
            about creating innovative solutions to complex problems.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
