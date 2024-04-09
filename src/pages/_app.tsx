import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";
import { appWithTranslation } from "next-i18next";

import { ThemeProvider } from "@/components/ThemeProvider";
import "@/styles/globals.css";
import Layout from "./layout";
import nextI18nConfig from "../../next-i18next.config.mjs";

import { Toaster } from "sonner";

const toastOptions = {
  // Figure this out at some later day
  // classNames: {
  //   success: "bg-success text-success-foreground",
  //   error: "bg-error text-error-foreground",
  //   info: "bg-info text-info-foreground",
  //   warning: "bg-warning text-warning-foreground",
  // },
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={toastOptions}
        closeButton
        richColors
      />
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </SessionProvider>
    </>
  );
};

const I18nApp = appWithTranslation(MyApp, nextI18nConfig);
const TRPCApp = api.withTRPC(I18nApp);


export default TRPCApp;
