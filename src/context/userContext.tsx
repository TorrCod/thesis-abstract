import { auth, signUp } from "@/lib/firebase";
import {
  addUserAccount,
  deleteAdmin,
  getAllUsers,
  getUserDetails,
  updateUser,
} from "@/utils/account-utils";
import { addThesis } from "@/utils/thesis-item-utils";
import { message } from "antd";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  Unsubscribe,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  AdminData,
  ThesisItems,
  UserAction,
  UserDetails,
  UserState,
  UserValue,
} from "./types.d";

const userStateInit: UserState = {
  userDetails: undefined,
  listOfAdmins: [],
};

const userValueInit: UserValue = {
  state: userStateInit,
  dispatch: () => {},
  saveUploadThesis: async () => {},
  loadAllUsers: async () => {},
  unsubscribeRef: { current: null },
};

const UserContext = createContext<UserValue>(userValueInit);

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "on-signin": {
      const newState = { ...state };
      newState["userDetails"] =
        action.payload.userDetails ?? newState["userDetails"];
      return newState;
    }
    case "on-signup": {
      return { ...state, userDetails: action.payload };
    }
    case "on-logout": {
      return { ...state, userDetails: undefined, listOfAdmins: [] };
    }
    case "load-all-users": {
      const payload = action.payload;
      const adminUsers: AdminData[] = payload.adminList.map((item) => {
        return {
          ...item,
          key: item._id,
          status: "Admin",
          dateAdded: item.dateAdded!,
        };
      });
      const pendingUsers: AdminData[] = payload.pendingAdminList.map((item) => {
        return {
          ...item,
          key: item._id,
          status: "Pending",
          dateAdded: item.createdAt,
        };
      });
      const allUsers: AdminData[] = [...adminUsers, ...pendingUsers];
      return { ...state, listOfAdmins: allUsers };
    }
  }
};

export const UserWrapper = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, userStateInit);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          console.log("signed in");
          const token = await user.getIdToken();
          const res = await getUserDetails(token, user.uid);
          res.profilePic = user.photoURL;
          dispatch({ type: "on-signin", payload: { userDetails: res } });
        } catch (e) {
          message.error("failed to fetch user details");
          console.error(e);
        }
      } else {
        dispatch({
          type: "on-logout",
        });
      }
      unsubscribeRef.current = unsubscribe;
    });
    return () => unsubscribe();
  }, []);

  const loadAllUsers = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const allUsers = await getAllUsers(token);
      dispatch({ type: "load-all-users", payload: allUsers });
    } catch (e) {
      message.error("failed to load all users");
      console.error(e);
    }
  };

  const userSignUp = async (userDetails: UserDetails) => {
    unsubscribeRef.current?.();
    const credential = await signUp(userDetails);
    delete userDetails.password;
    const token = await credential.user.getIdToken();
    userDetails.uid = credential.user.uid;
    const res = await addUserAccount(token, userDetails);
    dispatch({ type: "on-signin", payload: { userDetails: res } });
  };

  const userUpdateInfo = async (userDetails: UserDetails) => {
    const token = await auth.currentUser?.getIdToken();
    const id = userDetails._id;
    await updateUser(token, id, userDetails);
    dispatch({ type: "on-signin", payload: { userDetails: userDetails } });
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
    dispatch({ type: "on-signin", payload: { userDetails: userDetails } });
  };

  const deleteAccount = async (currpass: string) => {
    const cred = EmailAuthProvider.credential(
      state.userDetails!.email,
      currpass
    );
    try {
      await reauthenticateWithCredential(auth.currentUser!, cred);
      const userId = state.userDetails?._id;
      const token = await auth.currentUser?.getIdToken();
      await auth.currentUser?.delete();
      await deleteAdmin(token, userId);
    } catch (e) {
      throw new Error(e as string);
    }
  };

  const saveUploadThesis = async (thesisItems: ThesisItems) => {
    const userToken = await auth.currentUser?.getIdToken();
    await addThesis(thesisItems, userToken);
  };

  return (
    <UserContext.Provider
      value={{
        state,
        loadAllUsers,
        dispatch,
        userSignUp,
        userUpdateInfo,
        changePass,
        updateProfileUrl,
        deleteAccount,
        saveUploadThesis,
        unsubscribeRef,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

export default useUserContext;
