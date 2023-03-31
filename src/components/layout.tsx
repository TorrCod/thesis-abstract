import { GlobalWrapper } from "@/context/globalContext";
import { SocketWrapper } from "@/context/socketContext";
import { UserWrapper } from "@/context/userContext";
import AntD_Config from "@/styles/antd_config";
import Background from "./background";
import NavBar from "./navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalWrapper>
      <UserWrapper>
        <AntD_Config>
          <SocketWrapper>
            <NavBar />
            <main>
              <Background />
              {children}
            </main>
          </SocketWrapper>
        </AntD_Config>
      </UserWrapper>
    </GlobalWrapper>
  );
};

export default Layout;
