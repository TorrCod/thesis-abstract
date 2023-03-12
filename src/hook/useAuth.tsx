import useUserContext from "@/context/userContext";
import React, { useEffect, useRef } from "react";
import useGlobalContext from "@/context/globalContext";
import { useRouter } from "next/router";

const useAuth = () => {
  const isLogin = useUserContext().state.userDetails;
  const globalDispatch = useGlobalContext().dispatch;
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isLogin) {
        globalDispatch({ type: "sign-in", payload: true });
        router.push("/");
      }
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, [isLogin]);

  return isLogin;
};

export default useAuth;
