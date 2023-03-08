import { auth, signUp } from "@/lib/firebase";
import {
  addUserAccount,
  getUserDetails,
  updateUser,
  utils_Delete_Account,
} from "@/utils/account";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { UserAction, UserDetails, UserState, UserValue } from "./types.d";

const userStateInit: UserState = {
  userDetails: undefined,
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
  const [triggerUpdate, setTriggerUpdate] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const id = user.uid;
        getUserDetails(id)
          .then((res) => {
            console.log(res);
            if (typeof res === "object" && res !== null) {
              console.log("triggered");
              res.profilePic = auth.currentUser?.photoURL ?? undefined;
              dispatch({ type: "on-signin", payload: res });
            }
          })
          .catch((e) => {
            console.error(e);
          });
      } else {
        dispatch({ type: "on-signin", payload: undefined });
      }
    });
  }, [triggerUpdate]);

  const userSignUp = async (userDetails: UserDetails) => {
    const uid = await signUp(userDetails);
    delete userDetails.password;
    await addUserAccount({ ...userDetails, uid: uid });
    setTriggerUpdate(!triggerUpdate);
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

  const updateProfileUrl = async (userDetails: UserDetails) => {
    await updateProfile(auth.currentUser!, {
      photoURL: userDetails.profilePic,
    });
    await auth.updateCurrentUser(auth.currentUser);
    dispatch({ type: "on-signin", payload: userDetails });
  };

  const deleteAccount = async (currpass: string) => {
    const cred = EmailAuthProvider.credential(
      state.userDetails!.email,
      currpass
    );
    try {
      await reauthenticateWithCredential(auth.currentUser!, cred);
      await auth.currentUser?.delete();
      await utils_Delete_Account(state.userDetails!);
    } catch (e) {
      throw new Error(e as string);
    }
  };

  return (
    <UserContext.Provider
      value={{
        state,
        dispatch,
        userSignUp,
        userUpdateInfo,
        changePass,
        updateProfileUrl,
        deleteAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

export default useUserContext;
