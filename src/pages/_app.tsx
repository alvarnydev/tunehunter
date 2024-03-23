import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";
import { appWithTranslation } from "next-i18next";

import { ThemeProvider } from "@/components/ThemeProvider";
import "@/styles/globals.css";
import Layout from "./layout";
import { Toaster } from "sonner";

const toastOptions = {
  classNames: {
    toast: "bg-info",
  },
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Layout>
          <Component {...pageProps} />
          <Toaster position="bottom-center" toastOptions={toastOptions} />
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(appWithTranslation(MyApp));
