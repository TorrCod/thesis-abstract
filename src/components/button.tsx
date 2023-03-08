import { Button, ButtonProps } from "antd";
import { IoMdArrowRoundBack } from "react-icons/io";

export const PriButton = (props: ButtonProps) => {
  return (
    <Button className="bg-[#F8B49C] shadow-lg" type="primary" {...props} />
  );
};

export const SecButton = (props: ButtonProps) => {
  return <Button className="shadow-lg" type="default" {...props} />;
};

export const BackButton = (props: ButtonProps) => {
  return (
    <Button
      className="shadow-lg text-white flex justify-center items-center"
      type="default"
      {...props}
    >
      <IoMdArrowRoundBack />
      {props.children ?? "Back"}
    </Button>
  );
};
