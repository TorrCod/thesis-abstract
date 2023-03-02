import { signUp } from "@/lib/firebase";
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
    dispatch({ type: "on-signup", payload: userDetails });
    await signUp(userDetails);
  };

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

export default useUserContext;
