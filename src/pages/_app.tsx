import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { HookProvider } from "../hooks/hooksProvider";
import { HotkeysProvider } from "react-hotkeys-hook";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <HookProvider>
      <HotkeysProvider initiallyActiveScopes={["general"]}>
        <Component {...pageProps} />
      </HotkeysProvider>
    </HookProvider>
  );
};

export default api.withTRPC(MyApp);
