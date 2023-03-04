import { auth, signUp } from "@/lib/firebase";
import { addUserAccount, getUserDetails, updateUser } from "@/utils/account";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const id = user.uid;
        getUserDetails(id).then((res) => {
          dispatch({ type: "on-signin", payload: res });
        });
      } else {
        dispatch({ type: "on-signin", payload: null });
      }
    });
    return () => {};
  }, []);

  const userSignUp = async (userDetails: UserDetails) => {
    const uid = await signUp(userDetails);
    addUserAccount({ ...userDetails, uid: uid });
  };

  const userUpdateInfo = async (userDetails: UserDetails) => {
    await updateUser(userDetails);
    dispatch({ type: "on-signin", payload: userDetails });
  };

  const changePass = async (currpass: string, newpass: string) => {
    const cred = EmailAuthProvider.credential(
      state.userDetails!.email,
      currpass
    );
    await reauthenticateWithCredential(auth.currentUser!, cred);
    await updatePassword(auth.currentUser!, newpass);
  };

  return (
    <UserContext.Provider
      value={{ state, dispatch, userSignUp, userUpdateInfo, changePass }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

export default useUserContext;
