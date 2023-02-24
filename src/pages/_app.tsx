import Background from "@/components/background";
import NavBar from "@/components/navbar";
import AntD_Config from "@/styles/antd_config";
import "@/styles/globals.css";
import "@/styles/mediaqueries.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AntD_Config>
      <Background />
      <NavBar />
      <Component {...pageProps} />
    </AntD_Config>
  );
}
