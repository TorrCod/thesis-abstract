import { GlobalWrapper } from "@/context/globalContext";
import { UserWrapper } from "@/context/userContext";
import AntD_Config from "@/styles/antd_config";
import Background from "./background";
import NavBar from "./navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalWrapper>
      <UserWrapper>
        <AntD_Config>
          <NavBar />
          <main className="overflow-hidden md:overflow-auto">
            <Background />
            {children}
          </main>
        </AntD_Config>
      </UserWrapper>
    </GlobalWrapper>
  );
};

export default Layout;
