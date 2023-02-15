import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { HookProvider } from "../hooks/hooksProvider";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (

    <HookProvider>
    <Component {...pageProps} />
  </HookProvider>
  );
};

export default api.withTRPC(MyApp);
