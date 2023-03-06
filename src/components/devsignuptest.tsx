import { UserDetails } from "@/context/types.d";
import useUserContext from "@/context/userContext";
import { auth } from "@/lib/firebase";
import { message } from "antd";
import React, { useEffect } from "react";
import { PriButton } from "./button";

const DevSignUp = () => {
  const userCtx = useUserContext();
  //   useEffect(() => {
  //     return () => {
  //       auth.currentUser?.delete();
  //     };
  //   }, []);

  return (
    <PriButton
      onClick={async () => {
        try {
          const userDetails: UserDetails = {
            course: "Civil Engineer",
            email: "torrs@gmail.com",
            firstName: "Dev",
            lastName: "Test",
            password: "xaoskalsmdlkasd",
            userName: "walnbg_kwita",
          };
          await userCtx.userSignUp!(userDetails);
          message.success("You are now registered");
        } catch (e) {
          message.error((e as any).message);
        }
      }}
    >
      DEV SIGNUP
    </PriButton>
  );
};

export default DevSignUp;
