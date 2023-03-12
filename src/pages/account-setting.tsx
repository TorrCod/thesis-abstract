import DashboardLayout from "@/components/dashboardLayout";
import AdminProfile from "@/components/admin";
import { PriButton, SecButton } from "@/components/button";
import { Course, UserDetails } from "@/context/types.d";
import useUserContext from "@/context/userContext";
import { uploadProfile } from "@/lib/firebase";
import { getBase64, isObjectIncluded } from "@/utils/helper";
import {
  Divider,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Upload,
  UploadProps,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { RcFile } from "antd/lib/upload";
import React, { useEffect, useState } from "react";
import { BsImage } from "react-icons/bs";
import { useRouter } from "next/router";
import { GrUserSettings } from "react-icons/gr";
import { IoSettings } from "react-icons/io5";
import Head from "next/head";

const courseOpt: { value: Course; label: Course }[] = [
  { value: "Civil Engineer", label: "Civil Engineer" },
  { value: "Computer Engineer", label: "Computer Engineer" },
  { value: "Electrical Engineer", label: "Electrical Engineer" },
  { value: "Mechanical Engineer", label: "Mechanical Engineer" },
];

const AccountSetting = (props: { data: any; hasError: boolean }) => {
  const userCtx = useUserContext();
  const userDetails = userCtx.state.userDetails;
  const [form] = useForm();
  const [passForm] = useForm();
  const [infoSave, setInfoSave] = useState(true);
  const [newData, setNewData] = useState<UserDetails>();
  const [chngPassSave, setChngPassSave] = useState(true);
  const [chngProfSave, setChngProfSave] = useState(true);
  const [newProfile, setNewProfile] = useState<string | undefined>();
  const [cfrmDltAcc, setCfrmDltAcc] = useState("");
  const [onConfirm, setOnConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    form.resetFields();
    setNewProfile(userDetails?.profilePic);
    setChngProfSave(true);
  }, [userDetails, form]);

  useEffect(() => {
    if (userDetails && newData) {
      const isInclude = isObjectIncluded(newData, userDetails);
      setInfoSave(isInclude);
    }
  }, [newData, userDetails]);

  const handleInfoChange = () => {
    const infoFieldsData = form.getFieldsValue();
    setNewData(infoFieldsData);
  };

  const onInfoSave = async () => {
    try {
      const updatedUsdDtls: UserDetails = { ...userDetails!, ...newData };
      await userCtx.userUpdateInfo!(updatedUsdDtls);
      message.success("Your info is saved");
    } catch {
      message.error("Something Went Wrong! Please try in another time");
    }
  };

  const handlePassChange = async () => {
    try {
      await passForm.validateFields();
      setChngPassSave(false);
    } catch (e) {
      setChngPassSave(true);
    }
  };

  const handlePassSave = async () => {
    try {
      const data = passForm.getFieldsValue();
      const currPass = data["currPass"];
      const newPass = data["newPass"];
      await userCtx.changePass!(currPass, newPass);
      message.success("Your info is saved");
      passForm.resetFields();
    } catch (e) {
      const errMsg = (e as any).message;
      if (errMsg) {
        message.error("email / password incorrect");
      } else {
        message.error("Something Went Wrong! Please try in another time");
      }
    }
  };

  const uploadProps: UploadProps = {
    onChange(info) {
      getBase64(info.file as RcFile).then((url) => {
        setNewProfile(url);
        setChngProfSave(false);
      });
    },
    showUploadList: false,
    accept: ".jpg, .jpeg, .png",
    beforeUpload: () => false,
  };

  const handleProfCancel = () => {
    setNewProfile(userDetails?.profilePic);
    setChngProfSave(true);
  };

  const handleProfSave = () => {
    uploadProfile(newProfile!, userDetails?.uid!).then((url) => {
      const newProf: UserDetails = { ...userDetails!, profilePic: url };
      setNewProfile(url!);
      userCtx.updateProfileUrl!(newProf);
      setChngProfSave(true);
    });
  };

  const warning = () => {
    Modal.warning({
      title: "Please type the account's password",
      closable: true,
      content: (
        <Input
          onChange={(e) => {
            setCfrmDltAcc(e.target.value);
          }}
          placeholder="password"
        />
      ),
      maskClosable: true,
      okButtonProps: {
        htmlType: "submit",
        type: "primary",
        style: { backgroundColor: "#F8B49C" },
      },
      onOk() {
        setOnConfirm(!onConfirm);
      },
    });
  };

  useEffect(() => {
    if (cfrmDltAcc) {
      userCtx.deleteAccount!(cfrmDltAcc)
        .then(() => {
          router.push("/");
          message.success("Account Deleted");
        })
        .catch((e) => {
          console.error(e);
          message.error("Wrong Password");
        });
      setCfrmDltAcc("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onConfirm]);

  return (
    <>
      <DashboardLayout
        title={
          <div className="flex items-center gap-1 text-white">
            <IoSettings />{" "}
            <h3 className="whitespace-nowrap">Account Setting</h3>
          </div>
        }
        userSelectedMenu="/account-setting"
      >
        <div className="pb-10 w-full p-3 md:mt-5 mt-16 md:mb-20">
          <div className="grid gap-2 relative max-w-6xl m-auto ">
            <h3 className="text-black/90">Account Setting</h3>
            <div className="bg-white p-5 rounded-md shadow-md">
              <p>Information</p>
              <Divider />
              <Form
                onValuesChange={handleInfoChange}
                initialValues={{ ...userDetails }}
                form={form}
                layout="vertical"
                name="info"
              >
                <div className="md:grid md:grid-cols-2 md:place-items-center">
                  <div className="relative w-full px-10">
                    <Form.Item
                      name="firstName"
                      label={<div className="opacity-80">First Name</div>}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your first name",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="lastName"
                      label={<div className="opacity-80">Last Name</div>}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your last name",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="course"
                      label={<div className="opacity-80">Course</div>}
                    >
                      <Select
                        style={{ width: "auto", textAlign: "center" }}
                        options={courseOpt}
                      />
                    </Form.Item>
                  </div>
                  <div className="relative w-full px-10">
                    <Form.Item
                      name="email"
                      label={<div className="opacity-80">Email</div>}
                      rules={[
                        { required: true, message: "Please enter your email" },
                      ]}
                    >
                      <Input disabled />
                    </Form.Item>
                    <Form.Item
                      name="userName"
                      label={<div className="opacity-80">Username</div>}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your username",
                        },
                      ]}
                    >
                      <Input disabled />
                    </Form.Item>
                    <Form.Item
                      name="approove"
                      label={<div className="opacity-80">Added by</div>}
                    >
                      <Input disabled />
                    </Form.Item>
                  </div>
                </div>
                <Divider />
                <PriButton onClick={onInfoSave} disabled={infoSave}>
                  Save
                </PriButton>
              </Form>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <div className="bg-white p-5 rounded-md shadow-md">
                <p>Change Password</p>
                <Divider />
                <Form
                  onValuesChange={handlePassChange}
                  form={passForm}
                  className="px-10"
                  layout="vertical"
                  name="change-password"
                >
                  <Form.Item
                    name="newPass"
                    label={<div className="opacity-80">New Password</div>}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    dependencies={["newPass"]}
                    name="confirm-new-password"
                    label={
                      <div className="opacity-80">Confirm New Password</div>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("newPass") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("The two passwords do not match")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    name="currPass"
                    label={<div className="opacity-80">Current Password</div>}
                  >
                    <Input.Password />
                  </Form.Item>
                </Form>
                <Divider />
                <PriButton onClick={handlePassSave} disabled={chngPassSave}>
                  Save
                </PriButton>
              </div>
              <div className="bg-white p-5 rounded-md shadow-md w-full">
                <p>Profile Picture</p>
                <Divider />
                <Upload
                  {...uploadProps}
                  className="grid place-items-center relative"
                >
                  <div className="absolute w-[16.8em] rounded-full h-full bg-black/30 z-10 grid place-items-center cursor-pointer">
                    <BsImage size={"2em"} color="white" />
                  </div>
                  <AdminProfile
                    src={newProfile ?? undefined}
                    size={{ height: "16.8em", width: "16.8em" }}
                    userDetails={userDetails!}
                  />
                </Upload>
                <Divider />
                <Space>
                  <SecButton onClick={handleProfCancel} disabled={chngProfSave}>
                    cancel
                  </SecButton>
                  <PriButton onClick={handleProfSave} disabled={chngProfSave}>
                    Save
                  </PriButton>
                </Space>
              </div>
            </div>
            <div className="bg-white p-5 rounded-md shadow-md">
              <p>Delete Account</p>
              <Divider />
              <div className="px-10">
                <p className="mb-5 opacity-80">
                  Would you like to delete your account?
                </p>
                <p className="mb-5 opacity-80">
                  This will wipe all your data including your saved thesis but
                  not approoved thesis abstract.
                </p>
                <p
                  onClick={() => warning()}
                  className="text-red-600 decoration-red-600 decoration-1 underline cursor-pointer"
                >
                  I want to delete my account
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AccountSetting;
