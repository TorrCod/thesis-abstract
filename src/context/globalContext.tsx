import LoadingIcon from "@/components/loadingIcon";
import { courseOption } from "@/components/types.d";
import { auth } from "@/lib/firebase";
import {
  getAllDeletedThesis,
  getAllThesis,
  getDistincYear,
} from "@/utils/thesis-item-utils";
import { useRouter } from "next/router";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  Course,
  GlobalAction,
  GlobalState,
  GlobalValue,
  SearchQuery,
  ThesisItems,
} from "./types.d";

const globalStateInit: GlobalState = {
  thesisItems: [],
  dateOption: [],
  loading: ["all-admin"],
  recyclebin: [],
  searchThesis: [],
  filterState: {
    years: { all: true, option: [] },
    course: { all: true, option: courseOption as Course[] },
  },
};

const globalCtxInit: GlobalValue = {
  state: globalStateInit,
  dispatch: () => {},
  async loadThesisItems() {},
  recycledThesis: () => ({
    load: async () => {},
    clear: () => {},
  }),
  updateFilter: () => {},
  loadingState: {
    add(key) {},
    remove(key) {},
  },
  promptToSignIn() {},
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
  }
};

export const GlobalWrapper = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(globalReducer, globalStateInit);
  useEffect(() => {
    loadYearsOpt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.thesisItems]);

  const loadThesisItems = async (query?: SearchQuery, limit?: number) => {
    const thesisItems = await getAllThesis(query, {
      limit,
      projection: { title: 1, course: 1, dateAdded: 1 },
    });
    dispatch({
      type: "load-thesis",
      payload: thesisItems,
    });
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

  const recycledThesis = () => ({
    load: async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const recycledThesis = await getAllDeletedThesis(token);
        dispatch({ type: "load-recycle", payload: recycledThesis ?? [] });
      } catch (e) {
        console.error("failed to load deleted thesis");
        console.error(e);
      }
    },
    clear: () => dispatch({ type: "load-recycle", payload: [] }),
  });

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

  return (
    <GlobalContext.Provider
      value={{
        state,
        dispatch,
        loadThesisItems,
        recycledThesis,
        updateFilter,
        loadingState,
        promptToSignIn,
      }}
    >
      <LoadingGlobal loading={state.loading.includes("global")}>
        {children}
      </LoadingGlobal>
    </GlobalContext.Provider>
  );
};

export const LoadingGlobal = ({
  children,
  loading,
  backgroundColor,
}: {
  children?: React.ReactNode;
  loading: boolean;
  backgroundColor?: string;
}) => {
  const [noLoading, setNoLoading] = useState(loading);
  const [slide, setSlide] = useState(loading);

  useEffect(() => {
    setSlide(!loading);
    const timeOut = setTimeout(() => setNoLoading(loading), 300);
    return () => clearTimeout(timeOut);
  }, [loading]);

  return (
    <div
      className={noLoading ? "w-full h-screen overflow-hidden relative" : ""}
    >
      {noLoading ? (
        <div
          className={`absolute w-full h-screen bg-[${
            backgroundColor ?? "#38649C"
          }] z-[60] flex flex-col justify-center items-center text-white transition-transform duration-200 ease-out ${
            slide ? `-translate-x-full` : `translate-x-0`
          } `}
        >
          <h1>Loading</h1>
          <LoadingIcon />
        </div>
      ) : (
        <></>
      )}
      {children}
    </div>
  );
};

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export default useGlobalContext;
