import { GlobalWrapper } from "@/context/globalContext";
import { UserWrapper } from "@/context/userContext";
import AntD_Config from "@/styles/antd_config";
import Background from "./background";
import NavBar from "./navbar";
import WatchChanges from "./watchChanges";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalWrapper>
      <UserWrapper>
        <AntD_Config>
          <WatchChanges>
            <NavBar />
            <main>
              <Background />
              {children}
            </main>
          </WatchChanges>
        </AntD_Config>
      </UserWrapper>
    </GlobalWrapper>
  );
};

export default Layout;
