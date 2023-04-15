import React from "react";
import Image from "next/image";

const Background = () => {
  return (
    <div className="absolute h-96 w-96 -z-50 left-0 top-44 scale-[3] md:scale-[4] md:top-0 -translate-x-36 md:translate-x-80 xl:scale-[5.5] xl:translate-x-[25em]">
      <Image priority src="/bg-circles.svg" fill alt="Follow us on Twitter" />
    </div>
  );
};

export default Background;
