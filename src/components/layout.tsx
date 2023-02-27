import AntD_Config from "@/styles/antd_config";
import Background from "./background";
import NavBar from "./navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AntD_Config>
      <Background />
      <NavBar />
      {children}
    </AntD_Config>
  );
};

export default Layout;
