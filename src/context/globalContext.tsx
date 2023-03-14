import LoadingIcon from "@/components/loadingIcon";
import { getData } from "@/lib/mongo";
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
};

const globalCtxInit: GlobalValue = {
  state: globalStateInit,
  dispatch: () => {},
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
    fetch("/api/getThesisItems")
      .then((res) => res.json())
      .then((data) => {
        const listOfDate = [
          ...(data as ThesisItems[]).map((child) => child.date.slice(0, 4)),
        ];
        const dateOpt = Array.from(new Set(listOfDate)).sort();
        dispatch({
          type: "load-data",
          payload: { dateOpt: dateOpt, thesisItems: data },
        });
      });
  }, []);
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      <LoadingGlobal loading={state.loading}>{children}</LoadingGlobal>
    </GlobalContext.Provider>
  );
};

const LoadingGlobal = ({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading: boolean;
}) => {
  const [noLoading, setNoLoading] = useState(true);
  const [slide, setSlide] = useState(true);

  useEffect(() => {
    setSlide(!loading);
    const timeOut = setTimeout(() => setNoLoading(loading), 2000);
    return () => clearTimeout(timeOut);
  }, [loading]);

  return (
    <div
      className={noLoading ? "w-full h-screen overflow-hidden relative" : ""}
    >
      <div
        className={`absolute w-full h-screen bg-[#38649C] z-[1000] flex flex-col justify-center items-center text-white transition-transform duration-200 ease-out ${
          slide ? `-translate-x-full` : `translate-x-0`
        } `}
      >
        <h1>Loading</h1>
        <LoadingIcon />
      </div>
      {children}
    </div>
  );
};

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export default useGlobalContext;
