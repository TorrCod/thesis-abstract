import LoadingIcon from "@/components/loadingIcon";
import { auth } from "@/lib/firebase";
import {
  getAllDeletedThesis,
  getAllThesis,
  getDistincYear,
} from "@/utils/thesis-item-utils";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { GlobalAction, GlobalState, GlobalValue, ThesisItems } from "./types.d";

const globalStateInit: GlobalState = {
  thesisItems: [],
  dateOption: [],
  loading: false,
  recyclebin: [],
};

const globalCtxInit: GlobalValue = {
  state: globalStateInit,
  dispatch: () => {},
  async loadThesisItems() {},
  recycledThesis: () => ({
    load: async () => {},
    clear: () => {},
  }),
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
    case "load-data": {
      const newState = { ...state };
      newState["thesisItems"] = action.payload.thesisItems;
      newState["dateOption"] = action.payload.dateOpt;
      newState["loading"] = false;
      return newState;
    }
    case "sign-in":
      return { ...state, signIn: action.payload };

    case "load-recycle":
      return { ...state, recyclebin: action.payload };
  }
};

export const GlobalWrapper = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(globalReducer, globalStateInit);

  useEffect(() => {
    loadThesisItems();
  }, []);

  const loadThesisItems = async () => {
    const distinctYear = await getDistincYear();
    dispatch({
      type: "load-data",
      payload: {
        dateOpt: distinctYear,
        thesisItems: [],
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

  return (
    <GlobalContext.Provider
      value={{ state, dispatch, loadThesisItems, recycledThesis }}
    >
      <LoadingGlobal loading={state.loading}>{children}</LoadingGlobal>
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
