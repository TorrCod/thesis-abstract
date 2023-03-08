import { PriButton } from "@/components/button";
import DashboardLayout from "@/components/dashboardLayout";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Upload,
  UploadProps,
} from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { AiFillFileImage, AiOutlineUpload } from "react-icons/ai";
import { BiMinus, BiPlus } from "react-icons/bi";
import { FaAddressCard } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { FiHelpCircle } from "react-icons/fi";
import useUserContext from "@/context/userContext";
import axios from "axios";

const { Option } = Select;

interface FormValues {
  title: string;
  date: string;
  course: string[];
  researchers: string[];
}

const courseOptions = [
  { label: "Computer Engineer", value: "computer-engineer" },
  { label: "Mechanical Engineer", value: "mechanical-engineer" },
  { label: "Civil Engineer", value: "civil-engineer" },
  { label: "Electronics Engineer", value: "electronics-engineer" },
  { label: "Electrical Engineer", value: "electrical-engineer" },
];

const UploadThesis = () => {
  const [researchers, setResearchers] = useState<string[]>(["", ""]);
  const uid = useUserContext().state.userDetails?.uid;

  const onFinish = (values: FormValues) => {
    console.log(values);
    console.log(researchers);
  };

  const handleAddResearcher = () => {
    setResearchers([...researchers, ""]);
  };

  const handleResearcherChange = (index: number, value: string) => {
    const newResearchers = [...researchers];
    newResearchers[index] = value;
    setResearchers(newResearchers);
  };

  const uploadProps: UploadProps = {
    name: "file",
    accept: ".pdf,.jpg,.jpeg,.png",
    onChange(info: any) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    className:
      "border-[1px] h-96 w-full border-black/20 col-span-2 grid place-items-center",
    showUploadList: false,
    customRequest: ({ file, onSuccess }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uid", uid!);
      axios
        .post("/api/pdf-text", formData, { params: { uid } })
        .then((response) => {
          onSuccess!(response.data, file as any);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  };

  return (
    <DashboardLayout
      userSelectedMenu="/dashboard"
      userSelectedSider="/dashboard/thesis"
    >
      <div className="opacity-80 mb-3">
        <Link href="/dashboard/overview">Dashboard</Link> {">"}
        <Link href="/dashboard/thesis">Thesis</Link> {">"} Upload
      </div>
      <Form<FormValues>
        className="bg-white rounded-md shadow-md p-5 mb-20 relative pb-20 md:grid md:grid-cols-2 gap-x-5 max-w-5xl m-auto"
        onFinish={onFinish}
        layout="vertical"
      >
        <div>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item
            className=""
            name="course"
            label="Course"
            rules={[{ required: true }]}
          >
            <Select mode="multiple" options={courseOptions} />
          </Form.Item>
        </div>
        <Form.Item className="" label="Researchers">
          {researchers.map((researcher, index) => (
            <Input
              key={index}
              value={researcher}
              onChange={(e) => handleResearcherChange(index, e.target.value)}
              style={{ marginBottom: 8 }}
            />
          ))}
          <PriButton
            className="grid place-items-center text-white bg-[#F8B49C]"
            onClick={handleAddResearcher}
            shape="circle"
          >
            <BiPlus />
          </PriButton>
        </Form.Item>
        {/* <Form.Item
          className="col-span-2"
          name="abstract"
          label="Abstract"
          rules={[{ required: true }]}
        >
          <Input.TextArea autoSize={{ minRows: 10 }} />
        </Form.Item> */}
        <Upload {...uploadProps}>
          <div className="grid place-items-center">
            <AiFillFileImage size={"3em"} />
            <p className="text-center">
              Upload a thesis abstract in a pdf or image format
            </p>
          </div>
        </Upload>
        <p className="flex items-center gap-1">
          Help
          <FiHelpCircle />
        </p>
        <Form.Item className="absolute bottom-0 right-5">
          <PriButton
            type="primary"
            htmlType="submit"
            icon={<AiOutlineUpload />}
          >
            Upload
          </PriButton>
        </Form.Item>
      </Form>
    </DashboardLayout>
  );
};

export default UploadThesis;
