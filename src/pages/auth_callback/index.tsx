import { RedirectIndicator } from "@/components/Indicators";
import { playJingle } from "@/helpers/play-jingle";
import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "sonner";
import nextI18nConfig from "../../../next-i18next.config.mjs";

interface IPageProps {}

const AuthCallbackPage: NextPage<IPageProps> = ({}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { status } = useSession();

  const redirectingText = t("auth.redirecting");
  const loginSuccessText = t("toast.login.success");
  const loginErrorText = t("toast.login.error");

  useEffect(() => {
    if (status === "authenticated") {
      toast.success(loginSuccessText, { duration: 1800 });
      playJingle("normal");
    } else if (status === "unauthenticated") {
      toast.error(loginErrorText, { duration: 1800 });
    }
  }, [status]);

  useEffect(() => {
    setTimeout(() => {
      if (router.isReady) {
        const redirectPath = router.query.redirectPath as string;
        router.push(redirectPath);
      }
    }, 2000);
  }, [router]);

  return (
    <div className="flex items-baseline gap-2">
      <p className="text-lg text-foreground">{redirectingText}</p>
      <RedirectIndicator size={12} />
    </div>
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
