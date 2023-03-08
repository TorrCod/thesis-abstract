import { UserDetails } from "@/context/types.d";
import useUserContext from "@/context/userContext";
import { auth } from "@/lib/firebase";
import { message } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect } from "react";
import { PriButton } from "./button";

const DevSignUp = () => {
  const userCtx = useUserContext();
  useEffect(() => {
    try {
      // auth.currentUser?.delete().then(() => {
      //   console.log("successfully deleted");
      // });
      // signInWithEmailAndPassword(
      //   auth,
      //   "torrs@gmail.com",
      //   "xaoskalsmdlkasd"
      // ).then(() => {
      //   message.success("done");
      // });
    } catch (e) {
      console.error(e);
    }
  }, []);

  // auth.signOut()
  return (
    <PriButton
      onClick={async () => {
        // try {
        //   const userDetails: UserDetails = {
        //     course: "Civil Engineer",
        //     email: "torrs@gmail.com",
        //     firstName: "Dev",
        //     lastName: "Test",
        //     password: "xaoskalsmdlkasd",
        //     userName: "walnbg_kwita",
        //   };
        //   await userCtx.userSignUp!(userDetails);
        //   message.success("You are now registered");
        // } catch (e) {
        //   message.error((e as any).message);
        // }
      }}
    >
      DEV SIGNUP
    </PriButton>
  );
};

export default DevSignUp;
