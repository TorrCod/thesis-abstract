import { getData } from "@/lib/mongo";
import { createContext, useContext, useEffect, useReducer } from "react";
import { GlobalAction, GlobalState, GlobalValue, ThesisItems } from "./types.d";

const globalStateInit: GlobalState = {
  thesisItems: [],
  searchItems: [],
  dateOption: [],
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
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export default useGlobalContext;
