import React from "react";
import Image from "next/image";

const Background = () => {
  return (
    <div className="bg-circle">
      <Image src="bg-circles.svg" alt="background" fill />
    </div>
  );
};

export default Background;
