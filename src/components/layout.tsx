import { GlobalWrapper } from "@/context/globalContext";
import { UserWrapper } from "@/context/userContext";
import AntD_Config from "@/styles/antd_config";
import Background from "./background";
import NavBar from "./navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <GlobalWrapper>
        <UserWrapper>
          <AntD_Config>
            <NavBar />
            {children}
          </AntD_Config>
        </UserWrapper>
      </GlobalWrapper>
    </main>
  );
};

export default Layout;
