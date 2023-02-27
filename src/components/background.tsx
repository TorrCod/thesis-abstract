import React from "react";
import Image from "next/image";

const Background = () => {
  return (
    <div className="bg-circle">
      <Image priority={true} src="/bg-circles.svg" alt="background" fill />
    </div>
  );
};

export default Background;
