import { GlobalWrapper } from "@/context/globalContext";
import { UserWrapper } from "@/context/userContext";
import AntD_Config from "@/styles/antd_config";
import Background from "./background";
import NavBar from "./navbar";
import { Space } from "antd";
import { PriButton } from "./button";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserWrapper>
      <GlobalWrapper>
        <AntD_Config>
          <NavBar />
          <main className="overflow-hidden">
            <Background />
            {children}
          </main>
        </AntD_Config>
      </GlobalWrapper>
    </UserWrapper>
  );
};

export default Layout;
