import { signIn } from "next-auth/react";

export const buildRedirectUrl = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  params.delete("profile");
  url.search = params.toString();
  return url.pathname + url.search;
};

export const signInWithProvider = async (providerId: string, locale: string) => {
  const redirectPath = buildRedirectUrl();
  const callbackUrl = `/${locale}/auth_callback/?redirectUrl=${redirectPath}`;
  await signIn(providerId, { callbackUrl });
};
