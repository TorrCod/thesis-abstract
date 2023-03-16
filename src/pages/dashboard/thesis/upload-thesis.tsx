import { PriButton } from "@/components/button";
import DashboardLayout from "@/components/dashboardLayout";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Tooltip,
  Upload,
  UploadProps,
} from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  AiFillFileImage,
  AiOutlineUpload,
  AiOutlineUser,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { BiMinus, BiPlus } from "react-icons/bi";
import { FaAddressCard } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { FiHelpCircle } from "react-icons/fi";
import useUserContext from "@/context/userContext";
import axios from "axios";
import { getPdfText } from "@/utils/helper";
import LoadingIcon from "@/components/loadingIcon";
import { GeneratedTextRes } from "@/lib/types";
import { useForm } from "antd/lib/form/Form";
import { ThesisItems } from "@/context/types.d";
import moment from "moment";
import { MdSubtitles } from "react-icons/md";
import { useRouter } from "next/router";

interface FormValues {
  title: string;
  date: string;
  course: string;
  researchers: string[];
  abstract: string;
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
  const [loadingText, setLoadingText] = useState(false);
  const userCtx = useUserContext();
  const uid = userCtx.state.userDetails?.uid;
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: FormValues) => {
    try {
      const dateNow = new Date();
      const payload: ThesisItems = {
        abstract: values.abstract,
        course: values.course as any,
        dateAdded: dateNow,
        date: moment(values.date).format("YYYY-MM-DD"),
        title: values.title,
        id: "",
        researchers: researchers,
      };
      await userCtx.saveUploadThesis(payload);
      message.success("Success");
      router.push("/dashboard/thesis/success");
    } catch (e) {
      console.error(e);
      message.error("Upload Failed");
    }
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
    showUploadList: false,
    onChange(info: any) {
      const { status, response } = info.file;
      if (status === "done") {
        response
          .json()
          .then((data: any) => {
            let extractedText = getPdfText(data);
            extractedText = extractedText.replace(/\n\f|\n/g, " ");
            form.setFieldsValue({
              abstract: form.getFieldValue("abstract") ?? "" + extractedText,
            });
          })
          .finally(() => setLoadingText(false));
      }
    },
    beforeUpload() {
      setLoadingText(true);
    },
    customRequest(options) {
      const formData = new FormData();
      formData.append("file", options.file);
      formData.append("uid", uid ?? "no uid");

      fetch("/api/pdf-text", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          // handle response from server
          // reset loading state for Upload component
          if (options.onSuccess) {
            options.onSuccess(response);
          }
        })
        .catch((error) => {
          // handle error
          // reset loading state for Upload component
          console.log(error);
          message.error("Cant read files");
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
      <Form
        className="bg-white rounded-md shadow-md p-5 md:p-10 mb-20 relative pb-20 md:grid md:grid-cols-2 gap-x-20 max-w-5xl m-auto"
        onFinish={onFinish}
        layout="vertical"
        form={form}
        name="upload-thesis"
      >
        <div>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input suffix={<MdSubtitles />} />
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
            <Select className="max-w-[12rem]" options={courseOptions} />
          </Form.Item>
        </div>
        <Form.Item className="" label="Researchers">
          {researchers.map((researcher, index) => (
            <Input
              key={index}
              value={researcher}
              onChange={(e) => handleResearcherChange(index, e.target.value)}
              style={{ marginBottom: 8 }}
              suffix={<AiOutlineUser />}
            />
          ))}
          <PriButton
            className="grid place-items-center text-white bg-[#F8B49C]"
            onClick={handleAddResearcher}
            shape="circle"
          >
            <AiOutlineUserAdd />
          </PriButton>
        </Form.Item>
        <div className={`col-span-2 relative`}>
          <Upload
            disabled={loadingText}
            className="border-[1px] border-slate-300 shadow-sm rounded-md grid max-w-[15em] m-auto p-5 opacity-80 relative hover:border-[#4096ff] transition ease-in-out duration-200"
            {...uploadProps}
          >
            <div className="absolute w-fit m-auto right-0 left-0">
              <LoadingIcon className={loadingText ? "" : "hidden"} />
            </div>
            <AiFillFileImage className="m-auto" size={"3em"} />
            <p className="text-center">
              Upload a thesis abstract in a pdf or image format
            </p>
          </Upload>
          <Tooltip
            placement="bottom"
            title="Upload a file that contains abstract's body only"
          >
            <p className="flex items-center gap-1 mx-auto mt-1 w-fit">
              Help
              <FiHelpCircle />
            </p>
          </Tooltip>
          <Form.Item
            name="abstract"
            label="Abstract"
            rules={[{ required: true }]}
          >
            <Input.TextArea
              className="text-justify"
              autoSize={{ minRows: 10 }}
            />
          </Form.Item>
        </div>
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
