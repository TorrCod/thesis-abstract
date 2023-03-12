import useUserContext from "@/context/userContext";
import React, { useEffect } from "react";
import useGlobalContext from "@/context/globalContext";
import { useRouter } from "next/router";

const useAuth = () => {
  const isLogin = useUserContext().state.userDetails;
  const globalDispatch = useGlobalContext().dispatch;
  const router = useRouter();
  useEffect(() => {
    if (!isLogin) {
      globalDispatch({ type: "sign-in", payload: true });
      router.push("/");
    }
  }, [isLogin]);

  return isLogin;
};

export default useAuth;
