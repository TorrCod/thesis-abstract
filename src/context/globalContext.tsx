import LoadingIcon from "@/components/loadingIcon";
import { getData } from "@/lib/mongo";
import { getAllThesis, getDeletedThesis } from "@/utils/helper";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { GlobalAction, GlobalState, GlobalValue, ThesisItems } from "./types.d";

const globalStateInit: GlobalState = {
  thesisItems: [],
  searchItems: [],
  dateOption: [],
  loading: true,
  recyclebin: [],
};

const globalCtxInit: GlobalValue = {
  state: globalStateInit,
  dispatch: () => {},
  loadThesisItems() {},
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
      newState["searchItems"] = action.payload.thesisItems;
      newState["dateOption"] = action.payload.dateOpt;
      newState["loading"] = false;
      return newState;
    }
    case "search-data": {
      const newState = { ...state };
      const searchedItems = newState.thesisItems.filter((item) => {
        const itemTitle = item.title.toLowerCase();
        const itemDate = item.date;
        const searchTitle = action.payload.text.toLowerCase();
        const searchFilterDate = action.payload.filter.date;

        return (
          itemTitle.includes(searchTitle) &&
          searchFilterDate.includes(itemDate.slice(0, 4)) &&
          action.payload.filter.course.includes(item.course)
        );
      });
      newState["searchItems"] = searchedItems;
      return newState;
    }
    case "sign-in":
      return { ...state, signIn: action.payload };
  }
};

export const GlobalWrapper = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(globalReducer, globalStateInit);

  useEffect(() => {
    loadThesisItems().catch((e) => {
      console.log("Cannot Load Data");
      console.error(e);
    });
  }, []);

  const loadThesisItems = async () => {
    const thesisItems = await getAllThesis();
    const listOfDate = [
      ...(thesisItems as ThesisItems[]).map((child) => child.date.slice(0, 4)),
    ];
    const dateOpt = Array.from(new Set(listOfDate)).sort();
    dispatch({
      type: "load-data",
      payload: {
        dateOpt: dateOpt,
        thesisItems: thesisItems,
        recycledThesis: [],
      },
    });
  };

  const recycledThesis = (uid: string) => ({
    load: async () => {
      const recycledThesis = await getDeletedThesis(uid);
      dispatch({
        type: "load-data",
        payload: {
          dateOpt: state.dateOption,
          thesisItems: state.thesisItems,
          recycledThesis: recycledThesis ?? [],
        },
      });
    },
    clear: () =>
      dispatch({
        type: "load-data",
        payload: {
          dateOpt: state.dateOption,
          thesisItems: state.thesisItems,
          recycledThesis: [],
        },
      }),
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
  const [noLoading, setNoLoading] = useState(true);
  const [slide, setSlide] = useState(false);

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
