import useUserContext from "@/context/userContext";
import { auth } from "@/lib/firebase";
import { readSocket } from "@/utils/socket-utils";
import { useEffect } from "react";

const useOnUserChange = () => {
  const userDetails = useUserContext().state.userDetails;
  useEffect(() => {
    if (!userDetails) return;

    const unsubscribe = readSocket(
      userDetails.newToken,
      "account-update",
      async (changedStream) => {
        console.log(changedStream);
      }
    );
    return () => unsubscribe();
  }, [userDetails]);
};

export default useOnUserChange;
