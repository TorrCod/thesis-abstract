import { PriButton } from "@/components/button";
import { Course, UserDetails } from "@/context/types.d";
import useUserContext from "@/context/userContext";
import { Form, Input, message, Select } from "antd";

const courseOpt: { value: Course; label: String }[] = [
  { value: "Civil Engineer", label: "Civil Engineering" },
  { value: "Computer Engineer", label: "Computer Engineering" },
  { value: "Electrical Engineer", label: "Electrical Engineering" },
  { value: "Mechanical Engineer", label: "Mechanical Engineering" },
  { value: "Electronics Engineer", label: "Electronics Engineering" },
];
import { GetServerSideProps } from "next";
import { getOneData } from "@/lib/mongo";
import { ObjectId } from "mongodb";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const id = (ctx.params as any).id;
    const response = await getOneData("accounts", "pending", {
      _id: new ObjectId(id),
    });
    if (!response) throw new Error("no response");
    return {
      props: {
        data: {
          email: response.email,
          _id: response._id.toString(),
          approove: response.approove,
          role: response.role,
        },
      },
    };
  } catch (e) {
    console.error(e);
    return { notFound: true };
  }
};

const HandleInviteLink = (props: {
  data: {
    email: string;
    _id: string;
    approove: string;
    role: "admin" | "student";
  };
  hasError: boolean;
}) => {
  const [formSignUp] = Form.useForm();
  const { unsubscribeRef, userSignUp } = useUserContext();
  const handleSignUp = async () => {
    try {
      await formSignUp.validateFields();
      const payload = formSignUp.getFieldsValue();
      const userDetails: UserDetails = {
        email: payload["sign-up-email"],
        userName: payload["username"],
        course: payload["course"],
        firstName: payload["firstname"],
        lastName: payload["lastname"],
        password: payload["confirm-password"],
        dateAdded: new Date().toLocaleString(),
        profilePic: undefined,
        approove: props.data.approove,
        _id: props.data._id,
        role: props.data.role,
      };
      unsubscribeRef.current?.();
      await userSignUp?.(userDetails);
      message.success({
        type: "success",
        content: "Initialized Successfully",
      });
    } catch (error) {
      const errmessage = (error as any).message;
      if (errmessage) {
        message.error(errmessage);
      }
      console.error(error);
    }
  };

  return (
    <section className="md:pt-20 max-w-md m-auto">
      <Form className="bg-white py-2 px-5 rounded-md" form={formSignUp}>
        <h3 className="text-center my-5 text-[#38649C]">Sign Up</h3>
        <p className="m-5">
          Before we continue we would like to know more about you.
        </p>
        <Form.Item
          name="firstname"
          rules={[{ required: true, message: "Please enter your first name" }]}
        >
          <Input placeholder="First Name" />
        </Form.Item>
        <Form.Item
          name="lastname"
          rules={[{ required: true, message: "Please enter your last name" }]}
        >
          <Input placeholder="Last name" />
        </Form.Item>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please enter your Username" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="sign-up-email"
          rules={[
            { required: true, message: "Please enter your email" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || props.data.email === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Please use the email address that we sent the link to"
                  )
                );
              },
            }),
          ]}
        >
          <Input type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="course"
          rules={[{ required: true, message: "Please enter your course" }]}
        >
          <Select
            style={{ width: "13em", textAlign: "center" }}
            placeholder="Course"
            options={courseOpt}
          />
        </Form.Item>
        <Form.Item
          name="sign-up-password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="confirm-password"
          dependencies={["sign-up-password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("sign-up-password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>
        <Form.Item className="grid place-items-end">
          <PriButton htmlType="submit" onClick={handleSignUp}>
            Sign Up
          </PriButton>
        </Form.Item>
      </Form>
    </section>
  );
};

export default HandleInviteLink;
