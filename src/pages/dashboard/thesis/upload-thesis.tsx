import { PriButton } from "@/components/button";
import DashboardLayout from "@/components/dashboardLayout";
import {
  Form,
  Input,
  message,
  Select,
  Tooltip,
  Upload,
  UploadProps,
} from "antd";
import Link from "next/link";
import React, { ReactElement, useState } from "react";
import {
  AiFillFileImage,
  AiOutlineUpload,
  AiOutlineUser,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { FiHelpCircle } from "react-icons/fi";
import useUserContext from "@/context/userContext";
import { getBase64 } from "@/utils/helper";
import LoadingIcon from "@/components/loadingIcon";
import { ThesisItems } from "@/context/types.d";
import { MdSubtitles } from "react-icons/md";
import { useRouter } from "next/router";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { getCsrfToken } from "next-auth/react";
import { FaTrash } from "react-icons/fa";
import { uploadAbstract } from "@/lib/firebase";
import { ObjectId } from "mongodb";
import useGlobalContext from "@/context/globalContext";

interface FormValues {
  title: string;
  year: string;
  course: string;
  researchers: string[];
  abstract: string[];
}

const courseOptions = [
  { label: "Computer Engineer", value: "Computer Engineer" },
  { label: "Mechanical Engineer", value: "Mechanical Engineer" },
  { label: "Civil Engineer", value: "Civil Engineer" },
  { label: "Electronics Engineer", value: "Electronics Engineer" },
  { label: "Electrical Engineer", value: "Electrical Engineer" },
];

const Page = (props: { _id: string }) => {
  const [researchers, setResearchers] = useState<string[]>(["", ""]);
  const [loadingText, setLoadingText] = useState(false);
  const [abstract, setAbstract] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { loadThesisCount } = useGlobalContext();
  const userCtx = useUserContext();
  const [form] = Form.useForm<FormValues>();
  const router = useRouter();

  const onFinish = async (values: FormValues) => {
    try {
      if (!abstract.length)
        throw new Error("Please upload abstracts", { cause: "empty abstract" });
      setUploading(true);
      const dateNow = new Date();
      const urlList = await uploadAbstract(abstract, props._id);
      const payload: ThesisItems = {
        _id: props._id,
        abstract: urlList,
        course: values.course as any,
        dateAdded: dateNow,
        year: parseInt(values.year),
        title: values.title,
        id: props._id,
        researchers: researchers,
      };
      await userCtx.saveUploadThesis(payload);
      await loadThesisCount();
      message.success("Success");
      router.push("/dashboard/thesis/success");
    } catch (e) {
      if (((e as Error).cause = "empty abstract"))
        return message.error((e as Error).message);
      console.error(e);
      message.error("Upload Failed");
    } finally {
      setUploading(false);
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
    multiple: true,
    action: "/api/ping",
    beforeUpload: async (file) => {
      if (file.size >= 500000) {
        message.error("An Image must be less than 500kb");
        return false;
      }
      return true;
    },
    onChange(info) {
      const { status, originFileObj } = info.file;
      setLoadingText(status !== "done");
      if (status === "done" && originFileObj) {
        getBase64(originFileObj).then((url) => {
          setAbstract((oldValue) => [...oldValue, url]);
        });
      } else if (info.file.size ? info.file.size >= 500000 : false) {
        setLoadingText(false);
      }
    },
  };

  const handleRemove = (index: number) => {
    setAbstract((oldVal) => oldVal.filter((_, valIndex) => index !== valIndex));
  };

  const handleResearcherRemove = (index: number) => {
    setResearchers((oldVal) =>
      oldVal.filter((arg, valIndex) => valIndex !== index)
    );
  };

  return (
    <>
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
          <Form.Item name="year" label="Year" rules={[{ required: true }]}>
            <Input placeholder={new Date().getFullYear().toString()} />
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
            <div className="flex gap-1" key={index}>
              <Input
                value={researcher}
                onChange={(e) => handleResearcherChange(index, e.target.value)}
                style={{ marginBottom: 8 }}
                suffix={<AiOutlineUser />}
              />
              {researchers.length > 1 && (
                <PriButton
                  tabIndex={-1}
                  shape="circle"
                  onClick={() => handleResearcherRemove(index)}
                >
                  <FaTrash className="m-auto" />
                </PriButton>
              )}
            </div>
          ))}
          <PriButton
            className="grid place-items-center text-white bg-[#F8B49C]"
            onClick={handleAddResearcher}
            shape="circle"
          >
            <AiOutlineUserAdd />
          </PriButton>
        </Form.Item>
        {abstract.map((item, index) => (
          <div className="relative" key={index}>
            <img
              src={item}
              alt="abstract preview"
              key={index}
              placeholder="blur"
            />
            <div
              onClick={() => handleRemove(index)}
              className="absolute w-full h-full cursor-pointer transition-all duration-200 ease-in-out bg-black/0 z-10 top-0 left-0 text-red-500 grid place-content-center text-lg opacity-0 hover:bg-black/30 hover:opacity-100"
            >
              <FaTrash />
            </div>
          </div>
        ))}
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
              Upload a thesis abstract in a image format
            </p>
          </Upload>
          <Tooltip
            placement="bottom"
            title="The title page should be the first"
          >
            <p className="flex items-center gap-1 mx-auto mt-1 w-fit">
              Help
              <FiHelpCircle />
            </p>
          </Tooltip>
        </div>

        <Form.Item className="grid place-content-end mb-0 col-span-2 mt-10">
          <PriButton
            type="primary"
            htmlType="submit"
            icon={<AiOutlineUpload />}
            loading={uploading}
          >
            Upload
          </PriButton>
        </Form.Item>
      </Form>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  const csrfToken = await getCsrfToken({ req });
  const _id = new ObjectId().toString();
  if (!session)
    return {
      redirect: { destination: "/?signin" },
      props: { data: [] },
    };
  if (!csrfToken) return { notFound: true };
  return {
    props: {
      _id,
    },
  };
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Page;
