import { createContext, useContext } from "react";
import { GlobalState, ThesisItems } from "./types.d";
import thesisData from "@/data/data.json";

const globalContext_Init: GlobalState = {
  thesisItems: thesisData as unknown as ThesisItems[],
};

const GlobalContext = createContext<GlobalState>(globalContext_Init);

export const GlobalWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalContext.Provider value={globalContext_Init}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export default useGlobalContext;
