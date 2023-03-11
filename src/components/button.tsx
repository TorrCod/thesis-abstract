import { Button, ButtonProps } from "antd";
import { AiFillHome } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";

export const PriButton = (props: ButtonProps) => {
  return (
    <Button
      className="bg-[#F8B49C] shadow-lg flex items-center gap-1"
      type="primary"
      {...props}
    />
  );
};

export const SecButton = (props: ButtonProps) => {
  return <Button className="shadow-lg" type="default" {...props} />;
};

export const HomeButton = (props: ButtonProps) => {
  return (
    <Button
      className="shadow-lg text-white flex justify-center items-center gap-1"
      type="default"
      {...props}
    >
      <AiFillHome />
      {props.children ?? "Back"}
    </Button>
  );
};
