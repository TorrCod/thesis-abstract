import { auth, signUp } from "@/lib/firebase";
import {
  addUserAccount,
  deleteAdmin,
  getActivityLog,
  getAllUsers,
  getUserDetails,
  updateUser,
} from "@/utils/account-utils";
import { addThesis } from "@/utils/thesis-item-utils";
import { message } from "antd";
import axios from "axios";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signOut,
  Unsubscribe,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { signIn } from "next-auth/react";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import useGlobalContext from "./globalContext";
import {
  ActivityLog,
  AdminData,
  ThesisItems,
  UserAction,
  UserDetails,
  UserState,
  UserValue,
} from "./types.d";
import { signOut as nextSignOut } from "next-auth/react";

const userStateInit: UserState = {
  userDetails: undefined,
  listOfAdmins: [],
  activityLog: { currentPage: 1, totalCount: 0, document: [] },
  onlineMembers: [],
};

const userValueInit: UserValue = {
  state: userStateInit,
  dispatch: () => {},
  saveUploadThesis: async () => {},
  loadAllUsers: async () => {},
  unsubscribeRef: { current: null },
  async loadActivityLog(query) {
    return () => {};
  },
  async logOut() {},
  async refreshAdmin() {},
  addActivityLog(docs) {},
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
    case "load-activity-log": {
      return { ...state, activityLog: action.payload };
    }
    case "update-online-members": {
      return { ...state, onlineMembers: action.payload };
    }
  }
};

export const UserWrapper = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, userStateInit);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const { dispatch: gloablDispatch, state: globalState } = useGlobalContext();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const token = await user.getIdToken();
          const res: UserDetails = await getUserDetails(token, user.uid);
          res.profilePic = user.photoURL ?? undefined;
          dispatch({ type: "on-signin", payload: { userDetails: res } });
        } else {
          throw new Error("account logout", { cause: "logout" });
        }
      } catch (e) {
        if ((e as Error).cause === "logout") {
          axios.get("/api/logout");
        } else {
          console.error(e);
          logOut();
        }
      }
    });
    unsubscribeRef.current = unsubscribe;
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    await addUserAccount(token, userDetails);
    signIn("credentials", { callbackUrl: "/" }, { tokenId: token });
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
    const token = await auth.currentUser?.getIdToken();
    await updateUser(token, userDetails._id, userDetails);
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
      throw e;
    }
  };

  const saveUploadThesis = async (thesisItems: ThesisItems) => {
    const userToken = await auth.currentUser?.getIdToken();
    await addThesis(thesisItems, userToken);
  };

  const loadActivityLog = async (
    query?: Record<string, any>,
    pageNo?: number
  ) => {
    const token = await auth.currentUser?.getIdToken();
    const activityLog = await getActivityLog(
      token,
      query,
      undefined,
      pageNo ?? 1,
      globalState.searchingAction.pageSize
    ).catch((e) => {
      console.error(e);
    });
    if (activityLog)
      dispatch({ type: "load-activity-log", payload: activityLog });
    return clearActivitylog;
  };

  const addActivityLog = (docs: ActivityLog[]) => {
    const newActivitylogState = { ...state.activityLog };
    newActivitylogState.document = [...newActivitylogState.document, ...docs];
    dispatch({ type: "load-activity-log", payload: newActivitylogState });
  };

  const clearActivitylog = () => {
    dispatch({ type: "load-activity-log", payload: userStateInit.activityLog });
  };

  const refreshAdmin = async () => {
    await Promise.all([loadActivityLog(), loadAllUsers()]);
  };

  const logOut = async () => {
    dispatch({
      type: "on-logout",
    });
    dispatch({
      type: "load-all-users",
      payload: { adminList: [], pendingAdminList: [] },
    });
    dispatch({ type: "update-online-members", payload: [] });
    dispatch({
      type: "load-activity-log",
      payload: userStateInit.activityLog,
    });
    gloablDispatch({
      type: "load-thesis",
      payload: { currentPage: 1, document: [], totalCount: 0 },
    });
    gloablDispatch({
      type: "load-recycle",
      payload: { currentPage: 1, document: [], totalCount: 0 },
    });
    await auth.signOut();
    await nextSignOut({ callbackUrl: "/?signin" });
    await axios.get("/api/logout");
  };

  return (
    <UserContext.Provider
      value={{
        state,
        addActivityLog,
        refreshAdmin,
        loadAllUsers,
        dispatch,
        userSignUp,
        userUpdateInfo,
        changePass,
        updateProfileUrl,
        deleteAccount,
        saveUploadThesis,
        unsubscribeRef,
        loadActivityLog,
        logOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

export default useUserContext;
