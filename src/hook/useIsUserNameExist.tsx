import useUserContext from "@/context/userContext";
import React, { useEffect, useState } from "react";

const useIsUserNameExist = (inputUserName: string) => {
  const [isExist, setIsExist] = useState(false);
  const allUsers = useUserContext().state.listOfAdmins;
  useEffect(() => {
    console.log(allUsers);
  }, [allUsers]);

  return isExist;
};

export default useIsUserNameExist;
