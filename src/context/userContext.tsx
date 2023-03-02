import { signUp } from "@/lib/firebase";
import { addUserAccount } from "@/utils/account";
import { createContext, useContext, useEffect, useReducer } from "react";
import { UserAction, UserDetails, UserState, UserValue } from "./types.d";

const userStateInit: UserState = {
  userDetails: null,
};

const userValueInit: UserValue = {
  state: userStateInit,
  dispatch: () => {},
};

const UserContext = createContext<UserValue>(userValueInit);

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "on-signin": {
      return { ...state, userDetails: action.payload };
    }
    case "on-signup": {
      return { ...state, userDetails: action.payload };
    }
  }
};

export const UserWrapper = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, userStateInit);

  useEffect(() => {
    return () => {};
  }, []);

  const userSignUp = async (userDetails: UserDetails) => {
    const uid = await signUp(userDetails);
    addUserAccount({ ...userDetails, _id: uid });
  };

  return (
    <UserContext.Provider value={{ state, dispatch, userSignUp }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

export default useUserContext;
