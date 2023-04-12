import React from "react";
import NextImage from "next/image";

const Image = (props: { src: string; alt: string }) => {
  return <NextImage src={props.src} alt={props.alt} />;
};

export default Image;
