import { ConfigProvider, Button } from "antd";

const AntD_Config = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider
    theme={{
      components: {
        Button: { colorPrimaryHover: "#FCD1C2" },
      },
    }}
  >
    {children}
  </ConfigProvider>
);

export default AntD_Config;
