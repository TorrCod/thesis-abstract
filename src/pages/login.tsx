import { LogInUi } from "@/components/signin_signup";
import React from "react";
import { useEffectOnce } from "react-use";

const Login = () => {
  useEffectOnce(() => {
    const navRef = document.getElementsByClassName(
      "navbar"
    )[0] as HTMLDivElement;
    if (navRef) navRef.style.visibility = "hidden";

    return () => {
      if (navRef) navRef.style.visibility = "visible";
    };
  });
  return (
    <section>
      <div className="bg-white p-5 rounded-md max-w-lg m-auto md:mt-20">
        <LogInUi />
      </div>
    </section>
  );
};

export default Login;
