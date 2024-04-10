import LoadingIndicator from "@/components/LoadingIndicator";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";

interface IPageProps {}

const AuthCallbackPage: NextPage<IPageProps> = ({}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const redirectingText = t("auth.redirecting");
  const loginSuccessText = t("auth.toast.login.success");

  toast.success(loginSuccessText, { duration: 1800 });

  useEffect(() => {
    setTimeout(() => {
      if (router.isReady) {
        const redirectUrl = router.query.redirectUrl as string;
        router.push(redirectUrl);
      }
    }, 2000);
  }, [router]);

  return (
    <div className="flex items-baseline gap-2">
      <p className="text-lg text-foreground">{redirectingText}</p>
      <LoadingIndicator size={12} />
    </div>
  );
};

export default AuthCallbackPage;
