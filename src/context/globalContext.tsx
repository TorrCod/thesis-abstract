import { getData } from "@/lib/mongo";
import { createContext, useContext, useEffect, useReducer } from "react";
import { GlobalAction, GlobalState, ThesisItems } from "./types.d";

const globalContext_Init: GlobalState = {
  thesisItems: [],
};

const GlobalContext = createContext<GlobalState>(globalContext_Init);

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
      newState["thesisItems"] = action.payload;
      return newState;
    }
  }
};

export const GlobalWrapper = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(globalReducer, globalContext_Init);

  useEffect(() => {
    fetch("/api/getThesisItems")
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "load-data", payload: data });
      });
  }, []);

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export default useGlobalContext;
