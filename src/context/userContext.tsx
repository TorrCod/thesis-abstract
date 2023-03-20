import { auth, signUp } from "@/lib/firebase";
import {
  addThesis,
  addUserAccount,
  getAllUsers,
  getUserDetails,
  updateUser,
  utils_Delete_Account,
} from "@/utils/account";
import { message } from "antd";
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
  setTrigger: () => {},
  loadUser: (arg) => {},
};

const UserContext = createContext<UserValue>(userValueInit);

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "on-signin": {
      const newState = { ...state };
      newState["userDetails"] =
        action.payload.userDetails ?? newState["userDetails"];
      newState["listOfAdmins"] =
        action.payload.allUsers ?? newState["listOfAdmins"];
      return newState;
    }
    case "on-signup": {
      return { ...state, userDetails: action.payload };
    }
    case "on-logout": {
      return { ...state, userDetails: undefined, listOfAdmins: [] };
    }
  }
};

export const UserWrapper = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, userStateInit);
  const [triggerUpdate, setTriggerUpdate] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const id = user.uid;
        getUserDetails(id)
          .then((res) => {
            if (typeof res === "object" && res !== null) {
              res.profilePic = auth.currentUser?.photoURL ?? undefined;
              dispatch({ type: "on-signin", payload: { userDetails: res } });
            }
          })
          .catch((e) => {
            console.error(e);
          });
      } else {
        dispatch({
          type: "on-logout",
        });
      }
    });
    return () => unsubscribe();
  }, [triggerUpdate]);

  useEffect(() => {
    if (!state.userDetails) {
    } else {
      loadUser(state.userDetails.uid ?? "");
    }
  }, [state.userDetails]);

  const loadUser = (uid: string) => {
    getAllUsers(uid)
      .then(
        (res: {
          users: UserDetails[];
          pendingUsers: { payload: string; _id: string; createdAt: string }[];
        }) => {
          const admins: AdminData[] = res.users.map((item) => ({
            ...item,
            name: `${item.firstName} ${item.lastName}`,
            key: item._id ?? "",
            status: "admin",
            dateAdded: new Date(item.dateAdded ?? "").toLocaleString(),
          }));

          const pendingAdmins: AdminData[] = res.pendingUsers.map((item) => ({
            ...item,
            email: item.payload,
            key: item._id,
            dateAdded: item.createdAt,
            status: "pending",
          }));

          const allAdmins: AdminData[] = [...admins, ...pendingAdmins];
          dispatch({ type: "on-signin", payload: { allUsers: allAdmins } });
        }
      )
      .catch((res) => {
        message.error((res as Error).message);
      });
  };

  const userSignUp = async (userDetails: UserDetails) => {
    const uid = await signUp(userDetails);
    delete userDetails.password;
    await addUserAccount({ ...userDetails, uid: uid });
    setTriggerUpdate(!triggerUpdate);
  };

  const userUpdateInfo = async (userDetails: UserDetails) => {
    await updateUser(userDetails);
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
      await auth.currentUser?.delete();
      await utils_Delete_Account(state.userDetails?._id);
    } catch (e) {
      throw new Error(e as string);
    }
  };

  const saveUploadThesis = async (thesisItems: ThesisItems) => {
    await addThesis(thesisItems);
  };

  const setTrigger = () => {
    setTriggerUpdate(!triggerUpdate);
  };

  return (
    <UserContext.Provider
      value={{
        state,
        loadUser,
        dispatch,
        userSignUp,
        userUpdateInfo,
        changePass,
        updateProfileUrl,
        deleteAccount,
        saveUploadThesis,
        setTrigger,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

export default useUserContext;
