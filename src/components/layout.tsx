import { GlobalWrapper } from "@/context/globalContext";
import { UserWrapper } from "@/context/userContext";
import AntD_Config from "@/styles/antd_config";
import Background from "./background";
import NavBar from "./navbar";
import { Space } from "antd";
import { PriButton } from "./button";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalWrapper>
      <UserWrapper>
        <AntD_Config>
          <NavBar />
          <main className="overflow-hidden">
            <DevTools />
            <Background />
            {children}
          </main>
        </AntD_Config>
      </UserWrapper>
    </GlobalWrapper>
  );
};

const DevTools = () =>
  process.env.NODE_ENV === "development" ? (
    <div className="debug fixed top-0 left-0 p-10 z-50">
      <Space>
        <PriButton>Firebase Import</PriButton>
      </Space>
    </div>
  ) : (
    <></>
  );
export default Layout;
