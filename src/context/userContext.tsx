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
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
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

const userStateInit: UserState = {
  userDetails: undefined,
  listOfAdmins: [],
  activityLog: [],
};

const userValueInit: UserValue = {
  state: userStateInit,
  dispatch: () => {},
  saveUploadThesis: async () => {},
  loadAllUsers: async () => {},
  unsubscribeRef: { current: null },
  loadActivityLog: async () => {
    return [];
  },
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
  }
};

export const UserWrapper = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, userStateInit);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const {
    dispatch: gloablDispatch,
    recycledThesis,
    loadingState,
  } = useGlobalContext();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
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
        recycledThesis().clear();
        dispatch({
          type: "load-all-users",
          payload: { adminList: [], pendingAdminList: [] },
        });
        dispatch({
          type: "load-activity-log",
          payload: [],
        });
        gloablDispatch({ type: "load-thesis", payload: [] });
      }
      unsubscribeRef.current = unsubscribe;
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllUsers = async () => {
    try {
      loadingState.add("all-admin");
      const token = await auth.currentUser?.getIdToken();
      const allUsers = await getAllUsers(token);
      dispatch({ type: "load-all-users", payload: allUsers });
    } catch (e) {
      message.error("failed to load all users");
      console.error(e);
    } finally {
      loadingState.remove("all-admin");
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
      throw e;
    }
  };

  const saveUploadThesis = async (thesisItems: ThesisItems) => {
    const userToken = await auth.currentUser?.getIdToken();
    await addThesis(thesisItems, userToken);
  };

  const loadActivityLog = async () => {
    const token = await auth.currentUser?.getIdToken();
    const activityLog = (await getActivityLog(token)) as ActivityLog[];
    dispatch({ type: "load-activity-log", payload: activityLog });
    return activityLog;
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
        loadActivityLog,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

export default useUserContext;
