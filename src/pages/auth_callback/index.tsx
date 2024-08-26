import { RedirectIndicator } from "@/components/Indicators";
import { playJingle } from "@/helpers/play-jingle";
import useRouterWithHelpers from "@/hooks/useRouterWithHelpers";
import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { toast } from "sonner";
import nextI18nConfig from "../../../next-i18next.config.mjs";

interface IPageProps {}

const AuthCallbackPage: NextPage<IPageProps> = ({}) => {
  const router = useRouterWithHelpers();
  const { t } = useTranslation();
  const { status } = useSession();
  const loggedIn = status === "authenticated";
  const notLoggedIn = status === "unauthenticated";

  const redirectingText = t("auth.redirecting");
  const connectSuccessText = t("toast.connect.success");
  const loginSuccessText = t("toast.login.success");
  const loginErrorText = t("toast.login.error");

  useEffect(() => {
    if (!loggedIn || !router.isReady) {
      return;
    }

    const redirectPath = router.query.redirectPath as string;
    const actionParam = router.getParams("action");

    // Toast
    if (actionParam === "link") {
      toast.success(connectSuccessText, { duration: 1800 });
    } else {
      toast.success(loginSuccessText, { duration: 1800 });
    }

    // Redirect
    playJingle("normal");
    setTimeout(() => {
      router.push(redirectPath);
    }, 2000);
  }, [status, router]);

  return (
    <>
      {loggedIn && (
        <div className="flex items-baseline gap-2">
          <p className="text-lg text-foreground">{redirectingText}</p>
          <RedirectIndicator size={12} />
        </div>
      )}
      {notLoggedIn && <p>{loginErrorText}</p>}
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", "common", nextI18nConfig)),
    },
  };
};

export default AuthCallbackPage;
