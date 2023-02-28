import { Button, ButtonProps } from "antd";

export const PriButton = (Props: ButtonProps) => {
  return (
    <Button className="bg-[#F8B49C] shadow-lg" type="primary" {...Props} />
  );
};
