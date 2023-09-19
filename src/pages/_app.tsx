import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider, Viewport } from "@radix-ui/react-toast";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <ToastProvider duration={3000}>
        <Component {...pageProps} />
        <Viewport className="fixed bottom-0 right-0 w-full p-4" />
      </ToastProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
