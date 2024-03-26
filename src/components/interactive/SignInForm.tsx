import { Button } from "@/components/ui/button";
import { type Providers } from "@/interfaces/providers";
import { Mail } from "lucide-react";
import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { type FC, useEffect, useState } from "react";
import CustomIcon from "../CustomIcon";
import { CustomIconVariant, isCustomIcon } from "@/helpers/custom-icons";

const SignInForm: FC = ({}) => {
  const [providers, setProviders] = useState<Providers>();
  const router = useRouter();

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
      callbackUrl: `/auth_callback/?redirectUrl=${router.asPath}`,
    });
  };

  const handleSignInWithEmail = async () => {
    console.log("hi");
  };

  if (!providers) {
    return <></>;
  }

  const OAuthProviders = [providers.spotify];

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={handleSignInWithEmail}
        className="px-8 py-6 tracking-widest uppercase font-thin flex gap-2"
      >
        <CustomIcon icon="mail" height="22px" width="22px" />
        <p>Sign in with E-Mail</p>
      </Button>
      {OAuthProviders &&
        Object.values(OAuthProviders).map((provider, index) => (
          <div key={provider?.id ?? index}>
            <Button
              onClick={() =>
                provider?.id && handleSignInWithProvider(provider.id)
              }
              className="px-8 py-6 tracking-widest uppercase font-thin flex gap-2"
            >
              <CustomIcon
                icon={isCustomIcon(provider.id) ? provider.id : "fallback"}
                variant={CustomIconVariant.primary}
              />
              <p>Sign in with {provider.name}</p>
            </Button>
          </div>
        ))}
    </div>
  );
};

export default SignInForm;
