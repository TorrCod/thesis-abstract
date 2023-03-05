import { ConfigProvider, Button } from "antd";

const AntD_Config = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider
    theme={{
      components: {
        Button: {
          colorPrimaryHover: "#FCD1C2",
          colorPrimaryActive: "#38649C",
        },
      },
    }}
  >
    {children}
  </ConfigProvider>
);

export default AntD_Config;
