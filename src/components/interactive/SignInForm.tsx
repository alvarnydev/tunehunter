import { Button } from "@/components/ui/button";
import { CustomIconVariant, isCustomIcon } from "@/helpers/custom-icons";
import { type Providers } from "@/interfaces/providers";
import { getProviders, signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState, type FC } from "react";
import CustomIcon from "../CustomIcon";
import { Separator } from "../my-ui/separator";
import { Input } from "../ui/input";

const SignInForm: FC = ({}) => {
  const [providers, setProviders] = useState<Providers>();
  const router = useRouter();
  const { t } = useTranslation("");

  useEffect(() => {
    const fetchProviders = async () => {
      const resProviders = await getProviders();
      if (!resProviders) return;
      setProviders(resProviders);
    };

    fetchProviders();
  }, []);

  const handleSignInWithProvider = async (providerId: string) => {
    await signIn(providerId, {
      callbackUrl: `/${router.locale}/auth_callback/?redirectUrl=${router.asPath}`,
    });
  };

  const handleSignInWithEmail = async () => {
    console.log("hi");
  };

  if (!providers) {
    return <></>;
  }

  const OAuthProviders = [providers.spotify];
  const orText = t("general.or");
  const signInWithMailText = t("auth.signInWithEmail");
  const signInWithProviderText = (provider: string) => t("auth.signInWithProvider", { provider });

  return (
    <div className="flex flex-col gap-4 ">
      <Input type="email" placeholder="xyz@gmail.com" className="placeholder:text-foreground/50" />
      <Button
        onClick={handleSignInWithEmail}
        className="flex gap-2 px-8 py-6 font-light uppercase tracking-widest"
      >
        <CustomIcon icon="mail" height="22px" width="22px" variant={CustomIconVariant.foreground} />
        <p>{signInWithMailText}</p>
      </Button>
      <Separator text={orText} />
      {OAuthProviders &&
        Object.values(OAuthProviders).map((provider, index) => (
          <div key={provider?.id ?? index}>
            <Button
              onClick={() => provider?.id && handleSignInWithProvider(provider.id)}
              className="flex gap-2 px-8 py-6 font-light  uppercase tracking-widest"
            >
              <CustomIcon
                icon={isCustomIcon(provider.id) ? provider.id : "fallback"}
                variant={CustomIconVariant.foreground}
              />
              <p>{signInWithProviderText(provider.name)}</p>
            </Button>
          </div>
        ))}
    </div>
  );
};

export default SignInForm;
