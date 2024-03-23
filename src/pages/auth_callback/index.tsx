import LoadingIndicator from "@/components/LoadingIndicator";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "sonner";

interface IPageProps {}

const AuthCallbackPage: NextPage<IPageProps> = ({}) => {
  const router = useRouter();
  toast.success("Successfully logged in!", { duration: 1500 });

  useEffect(() => {
    setTimeout(() => {
      if (router.isReady) {
        const redirectUrl = router.query.redirectUrl as string;
        router.push(redirectUrl);
      }
    }, 2000);
  }, [router]);

  return (
    <div className="flex flex-col gap-4">
      <LoadingIndicator size={24} />
      <p>Redirecting...</p>
    </div>
  );
};

export default AuthCallbackPage;
