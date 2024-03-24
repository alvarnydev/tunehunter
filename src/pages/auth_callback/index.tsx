import LoadingIndicator from "@/components/LoadingIndicator";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "sonner";

interface IPageProps {}

const AuthCallbackPage: NextPage<IPageProps> = ({}) => {
  const router = useRouter();
  toast.success("Successfully logged in!", { duration: 1800 });

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
      <p className="text-foreground text-lg">Redirecting</p>
      <LoadingIndicator size={12} />
    </div>
  );
};

export default AuthCallbackPage;
