import { ConfigProvider, Button } from "antd";

const AntD_Config = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider
    theme={{
      components: {
        Button: {
          colorPrimaryHover: "#ffe5db",
          colorPrimaryActive: "#38649C",
        },
      },
    }}
  >
    {children}
  </ConfigProvider>
);

export default AntD_Config;
