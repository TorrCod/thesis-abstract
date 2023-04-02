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
  SearchAction,
  SearchOption,
  SearchQuery,
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
  thesisItems: { totalCount: 0, currentPage: 1, document: [] },
  dateOption: [],
  loading: ["all-thesis", "all-admin"],
  recyclebin: { totalCount: 0, currentPage: 1, document: [] },
  searchThesis: [],
  totalThesisCount: { totalCount: 0, thesisCount: totalDataInit },
  searchingAction: {
    filterState: {
      years: { all: true, default: [] },
      course: { all: true, option: courseOption, default: courseOption },
    },
  },
};

const globalCtxInit: GlobalValue = {
  state: globalStateInit,
  dispatch: () => {},
  async loadThesisItems() {},
  async loadRecycle() {},
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
  updateSearchAction() {
    return { update(payload) {}, clear() {} };
  },
};

const GlobalContext = createContext<GlobalValue>(globalCtxInit);

const globalReducer = (
  state: GlobalState,
  action: GlobalAction
): GlobalState => {
  switch (action.type) {
    case "add-thesis": {
      const newState = { ...state };
      newState.thesisItems.document.push(action.payload);
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
    case "update-default-years":
      return { ...state, dateOption: action.payload };
    case "add-loading": {
      return { ...state, loading: action.payload };
    }
    case "load-thesis-count": {
      return { ...state, totalThesisCount: action.payload };
    }
    case "on-search-action": {
      return { ...state, searchingAction: action.payload };
    }
  }
};

export const GlobalWrapper = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(globalReducer, globalStateInit);

  useEffect(() => {
    loadYearsOpt();
  }, []);

  const updateSearchAction = () => {
    const update = (payload: SearchAction) => {
      dispatch({ type: "on-search-action", payload: payload });
    };
    const clear = () => {
      const newFilterState = { ...state.searchingAction.filterState };
      newFilterState.years.option = newFilterState.years.default;
      dispatch({
        type: "on-search-action",
        payload: {
          ...globalStateInit.searchingAction,
          filterState: newFilterState,
        },
      });
    };
    return { update, clear };
  };

  const loadThesisItems = async (
    query?: SearchQuery,
    option?: SearchOption
  ) => {
    try {
      loadingState.add("all-thesis");
      const { searchTitle: title } = state.searchingAction;
      const { option: course } = state.searchingAction.filterState.course;
      const { option: year } = state.searchingAction.filterState.years;
      const thesisItems = await getAllThesis(
        {
          title: query?.title ?? title,
          course: query?.course ?? course,
          year: query?.year ?? year,
        },
        {
          limit: option?.limit ?? 10,
          projection: option?.projection ?? {
            title: 1,
            course: 1,
            dateAdded: 1,
          },
        },
        state.searchingAction.pageNo
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
        { title: state.searchingAction.searchTitle },
        {
          limit: 10,
          projection: {
            title: 1,
            course: 1,
            createdAt: 1,
            expireAfterSeconds: 1,
          },
        },
        state.searchingAction.pageNo
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
      type: "on-search-action",
      payload: {
        ...state.searchingAction,
        filterState: {
          ...state.searchingAction.filterState,

          years: { all: true, option: distinctYear, default: distinctYear },
        },
      },
    });
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
      payload: {
        ...state.thesisItems,
        document: [document, ...state.thesisItems.document],
      },
    });
  };

  const removeThesisItem = (_id: string) => {
    const oldDoc = [...state.thesisItems.document];
    const newDoc = oldDoc.filter((item) => item._id !== _id);
    dispatch({
      type: "load-thesis",
      payload: { ...state.thesisItems, document: newDoc },
    });
    loadThesisItems();
  };

  const recycleThesis = (thesis: ThesisItems) => {
    const oldRecyleThesis = [...state.recyclebin.document];
    if (oldRecyleThesis.length >= 10) oldRecyleThesis.pop();
    dispatch({
      type: "load-recycle",
      payload: { ...state.recyclebin, document: [thesis, ...oldRecyleThesis] },
    });
  };

  const restoreThesis = (_id: string) => {
    const oldRecyle = [...state.recyclebin.document];
    const newRecyle = oldRecyle.filter((item) => item._id !== _id);
    dispatch({
      type: "load-recycle",
      payload: { ...state.recyclebin, document: newRecyle },
    });
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
        loadingState,
        promptToSignIn,
        loadThesisCount,
        addThesisItem,
        removeThesisItem,
        updateSearchAction,
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
