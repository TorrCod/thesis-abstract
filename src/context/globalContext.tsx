import { createContext, useContext, useReducer } from "react";
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
  }
};

export const GlobalWrapper = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(globalReducer, globalContext_Init);

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export default useGlobalContext;
