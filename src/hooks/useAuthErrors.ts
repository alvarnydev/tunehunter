import { isNextAuthError } from "@/helpers/nextauth-errors";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import useRouterWithHelpers from "./useRouterWithHelpers";

// If a type is specified, the error message will be more specific depending on which context we're in.

const useAuthError = (type?: "login" | "link") => {
  const router = useRouterWithHelpers();
  const { t } = useTranslation("");
  const [authError, setAuthError] = useState<string | null>(null);

  const getNextAuthErrorText = (errorString: string) =>
    t(`auth.errors.${errorString}${type && `_${type}`}`);

  // Check for errors in URL
  useEffect(() => {
    const errorParams = router.getParams("error");
    if (!errorParams) return;

    if (isNextAuthError(errorParams)) {
      const errorText = getNextAuthErrorText(errorParams);
      setAuthError(errorText);
    }
  }, [router.isReady]);

  return authError;
};

export default useAuthError;
