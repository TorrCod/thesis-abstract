import AdminProfile from "@/components/admin";
import { PriButton } from "@/components/button";
import { Course, UserDetails } from "@/context/types.d";
import useUserContext from "@/context/userContext";
import { isObjectIncluded } from "@/utils/helper";
import { Divider, Form, Input, message, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { BsImage } from "react-icons/bs";

const courseOpt: { value: Course; label: Course }[] = [
  { value: "Civil Engineer", label: "Civil Engineer" },
  { value: "Computer Engineer", label: "Computer Engineer" },
  { value: "Electrical Engineer", label: "Electrical Engineer" },
  { value: "Mechanical Engineer", label: "Mechanical Engineer" },
];

const AccountSetting = () => {
  const userCtx = useUserContext();
  const userDetails = userCtx.state.userDetails;
  const [form] = useForm();
  const [infoSave, setInfoSave] = useState(true);
  const [newData, setNewData] = useState<UserDetails>();
  const [chngPassSave, setChngPassSave] = useState(true);
  const [chngProfSave, setChngProfSave] = useState(true);

  useEffect(() => {
    form.resetFields();
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

  return (
    <section className="pb-10 w-full md:pt-20">
      <div className="grid gap-2 relative max-w-3xl m-auto">
        <h3 className="text-white opacity-80">Account Setting</h3>
        <div className="bg-slate-100 p-5 rounded-md shadow-md">
          <p>Information</p>
          <Divider />
          <Form
            onValuesChange={handleInfoChange}
            initialValues={{ ...userDetails }}
            form={form}
            layout="vertical"
          >
            <div className="md:grid md:grid-cols-2 md:place-items-center">
              <div className="relative w-full px-10">
                <Form.Item
                  name="firstName"
                  label={<div className="opacity-80">First Name</div>}
                  rules={[
                    { required: true, message: "Please enter your first name" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  label={<div className="opacity-80">Last Name</div>}
                  rules={[
                    { required: true, message: "Please enter your last name" },
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
                    { required: true, message: "Please enter your username" },
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
        <div className="md:grid md:grid-cols-2 gap-2">
          <div className="bg-slate-100 p-5 rounded-md shadow-md">
            <p>Change Password</p>
            <Divider />
            <Form className="px-10" layout="vertical">
              <Form.Item
                name="new-password"
                label={<div className="opacity-80">New Password</div>}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="current-password"
                label={<div className="opacity-80">Current Password</div>}
              >
                <Input />
              </Form.Item>
            </Form>
            <Divider />
            <PriButton disabled={chngPassSave}>Save</PriButton>
          </div>
          <div className="bg-slate-100 p-5 rounded-md shadow-md">
            <p>Profile Picture</p>
            <Divider />
            <div className="grid place-items-center relative">
              <div className="absolute w-[8.57em] rounded-full h-full bg-black/30 z-10 grid place-items-center cursor-pointer">
                <BsImage size={"2em"} color="white" />
              </div>
              <AdminProfile
                size={{ height: "10em", width: "10em" }}
                userDetails={userDetails!}
              />
            </div>
            <Divider />
            <PriButton disabled={chngProfSave}>Save</PriButton>
          </div>
        </div>
        <div className="bg-slate-100 p-5 rounded-md shadow-md">
          <p>Delete Account</p>
          <Divider />
          <div className="px-10">
            <p className="mb-5 opacity-80">
              Would you like to delete your account?
            </p>
            <p className="mb-5 opacity-80">
              This will wipe all your data including your saved thesis but not
              approoved thesis abstract.
            </p>
            <p className="text-red-600 decoration-red-600 decoration-1 underline cursor-pointer">
              I want to delete my account
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountSetting;
