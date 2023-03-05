import React from "react";
import Image from "next/image";

const Background = () => {
  return (
    <div className="bg-circle">
      <Image priority src="/bg-circles.svg" fill alt="Follow us on Twitter" />
    </div>
  );
};

export default Background;
