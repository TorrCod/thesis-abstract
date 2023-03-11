import React from "react";

const LoadingIcon = ({ className }: { className?: string }) => {
  return (
    <div className={`lds-ellipsis ${className}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingIcon;
