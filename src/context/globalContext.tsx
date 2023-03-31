import LoadingIcon from "@/components/loadingIcon";
import { courseOption } from "@/components/types.d";
import { auth } from "@/lib/firebase";
import {
  getAllDeletedThesis,
  getAllThesis,
  getDistincYear,
  getThesisCount,
} from "@/utils/thesis-item-utils";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { io } from "socket.io-client";
import {
  Course,
  GlobalAction,
  GlobalState,
  GlobalValue,
  ThesisItems,
} from "./types.d";
import Router from "next/router";

const totalDataInit: { course: Course; count: number }[] = [
  { course: "Civil Engineer", count: 0 },
  { course: "Computer Engineer", count: 0 },
  { course: "Mechanical Engineer", count: 0 },
  { course: "Electronics Engineer", count: 0 },
  { course: "Electrical Engineer", count: 0 },
];

const globalStateInit: GlobalState = {
  thesisItems: [],
  dateOption: [],
  loading: ["all-thesis", "all-admin"],
  recyclebin: [],
  searchThesis: [],
  filterState: {
    years: { all: true, option: [] },
    course: { all: true, option: courseOption as Course[] },
  },
  totalThesisCount: { totalCount: 0, thesisCount: totalDataInit },
  searchTitle: "",
};

const globalCtxInit: GlobalValue = {
  state: globalStateInit,
  dispatch: () => {},
  async loadThesisItems() {},
  async loadRecycle() {},
  updateFilter: () => {},
  loadingState: {
    add(key) {},
    remove(key) {},
  },
  promptToSignIn() {},
  async loadThesisCount() {},
  addThesisItem(document) {},
  removeThesisItem(_id) {},
  restoreThesis(_id) {},
  recycleThesis(thesis) {},
  updateSearchTitle(title) {},
};

const GlobalContext = createContext<GlobalValue>(globalCtxInit);

const globalReducer = (
  state: GlobalState,
  action: GlobalAction
): GlobalState => {
  switch (action.type) {
    case "add-thesis": {
      const newState = { ...state };
      newState.thesisItems.push(action.payload);
      return newState;
    }
    case "load-thesis": {
      const newState = { ...state };
      newState["thesisItems"] = action.payload;
      return newState;
    }
    case "sign-in":
      return { ...state, signIn: action.payload };

    case "load-recycle":
      return { ...state, recyclebin: action.payload };

    case "update-filter":
      return { ...state, filterState: action.payload };
    case "update-default-years":
      return { ...state, dateOption: action.payload };
    case "add-loading": {
      return { ...state, loading: action.payload };
    }
    case "load-thesis-count": {
      return { ...state, totalThesisCount: action.payload };
    }
    case "update-search": {
      return { ...state, searchTitle: action.payload };
    }
  }
};

export const GlobalWrapper = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(globalReducer, globalStateInit);
  useEffect(() => {
    loadYearsOpt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.thesisItems]);

  const loadThesisItems = async () => {
    try {
      loadingState.add("all-thesis");
      const thesisItems = await getAllThesis(
        { title: state.searchTitle },
        {
          limit: 10,
          projection: { title: 1, course: 1, dateAdded: 1 },
        }
      );
      dispatch({
        type: "load-thesis",
        payload: thesisItems,
      });
    } catch (e) {
      console.error(e);
    } finally {
      loadingState.remove("all-thesis");
    }
  };

  const loadRecycle = async () => {
    try {
      loadingState.add("all-thesis");
      const token = await auth.currentUser?.getIdToken();
      const recycledThesis = await getAllDeletedThesis(
        token,
        { title: state.searchTitle },
        {
          limit: 10,
          projection: {
            title: 1,
            course: 1,
            createdAt: 1,
            expireAfterSeconds: 1,
          },
        }
      );
      dispatch({ type: "load-recycle", payload: recycledThesis ?? [] });
    } catch (e) {
      console.error(e);
    } finally {
      loadingState.remove("all-thesis");
    }
  };

  const loadYearsOpt = async () => {
    const distinctYear = await getDistincYear();
    dispatch({ type: "update-default-years", payload: distinctYear });
    dispatch({
      type: "update-filter",
      payload: {
        ...state.filterState,
        years: { all: true, option: distinctYear },
      },
    });
  };

  const updateFilter = (payload: {
    years: {
      all: boolean;
      option: string[];
    };
    course: {
      all: boolean;
      option: Course[];
    };
  }) => {
    dispatch({ type: "update-filter", payload: payload });
  };

  const loadingState = {
    add(key: string) {
      if (state.loading.includes(key)) return;
      dispatch({ type: "add-loading", payload: [...state.loading, key] });
    },
    remove(key: string) {
      const oldLoadingData = [...state.loading];
      const newLoadingData = oldLoadingData.filter((name) => name !== key);
      dispatch({ type: "add-loading", payload: newLoadingData });
    },
  };

  const promptToSignIn = () => {
    dispatch({ type: "sign-in", payload: true });
  };

  const loadThesisCount = async () => {
    try {
      const countThesis = await getThesisCount();
      dispatch({ type: "load-thesis-count", payload: countThesis });
    } catch (e) {
      console.error(e);
    }
  };

  const addThesisItem = (document: ThesisItems) => {
    dispatch({
      type: "load-thesis",
      payload: [document, ...state.thesisItems],
    });
  };

  const removeThesisItem = (_id: string) => {
    const oldThesisItems = [...state.thesisItems];
    const newThesisItems = oldThesisItems.filter((item) => item._id !== _id);
    dispatch({ type: "load-thesis", payload: newThesisItems });
    loadThesisItems();
  };

  const recycleThesis = (thesis: ThesisItems) => {
    const oldRecyleThesis = [...state.recyclebin];
    if (oldRecyleThesis.length >= 10) oldRecyleThesis.pop();
    dispatch({ type: "load-recycle", payload: [thesis, ...oldRecyleThesis] });
  };

  const restoreThesis = (_id: string) => {
    const oldRecyle = [...state.recyclebin];
    const newRecyle = oldRecyle.filter((item) => item._id !== _id);
    dispatch({ type: "load-recycle", payload: newRecyle });
  };

  const updateSearchTitle = (title: string | undefined) => {
    dispatch({ type: "update-search", payload: title });
  };

  return (
    <GlobalContext.Provider
      value={{
        state,
        recycleThesis,
        restoreThesis,
        dispatch,
        loadThesisItems,
        loadRecycle,
        updateFilter,
        loadingState,
        promptToSignIn,
        loadThesisCount,
        addThesisItem,
        removeThesisItem,
        updateSearchTitle,
      }}
    >
      <LoadingGlobal>{children}</LoadingGlobal>
    </GlobalContext.Provider>
  );
};

export const LoadingGlobal = ({ children }: { children?: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <>
      <div
        className={`absolute left-5 transition-all duration-200 ease-in-out z-50 ${
          loading ? `top-0` : `-top-24`
        }`}
      >
        <LoadingIcon />
      </div>
      <div>{children}</div>
    </>
  );
};

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export default useGlobalContext;
