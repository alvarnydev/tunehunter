import { signIn } from "next-auth/react";

export const buildRedirectPath = () => {
  const url = new URL(window.location.href);

  // Remove locale from URL (-> prevent mismatches between DB query and hard-coded redirect-path before login)
  const locale = url.pathname.slice(1, 3);
  if (locale === "de" || locale === "es") {
    url.pathname = url.pathname.slice(3);
  }

  // Remove profile parameter (-> close profile menu after redirect)
  const params = new URLSearchParams(url.search);
  params.delete("profile");
  url.search = params.toString();

  // Put back together
  const redirectPath = url.pathname + url.search;
  return redirectPath;
};

export const signInWithProvider = async (providerId: string, locale: string) => {
  const redirectPath = buildRedirectPath();
  const callbackUrl = `/${locale}/auth_callback/?redirectPath=${redirectPath}`;
  await signIn(providerId, { callbackUrl });
};
