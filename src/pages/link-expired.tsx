import { PriButton } from "@/components/button";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { TbLinkOff } from "react-icons/tb";

const LinkExpired = () => {
  const router = useRouter();
  useEffect(() => {
    document.getElementsByTagName("main")[0].style.overflowY = "hidden";
    return () => {
      document.getElementsByTagName("main")[0].style.overflowY = "visible";
    };
  }, []);

  const handleForgotPass = () => {
    router.push("/forgot-password");
  };

  return (
    <section
      style={{ paddingTop: 0 }}
      className="text-white m-auto max-w-2xl grid place-content-center"
    >
      <div>
        <h1 className="text-center grid place-items-center gap-10">
          <div className="bg-white/30 px-10 py-5 rounded-md">
            <TbLinkOff size={100} />
          </div>
          The invite link is expired
        </h1>
        <p className="text-center opacity-70">
          Hello, it appears that your invitation link has expired because you
          did not open it within the specified time or because your email is
          already associated with an admin account on this website.
        </p>
        <div className="flex w-full justify-center mt-5">
          <PriButton onClick={handleForgotPass}>Forgot Password</PriButton>
        </div>
      </div>
    </section>
  );
};

export default LinkExpired;
