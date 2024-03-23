import { Button } from "@/components/ui/button";
import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { type FC, useEffect, useState } from "react";

const SignInForm: FC = ({}) => {
  const [providers, setProviders] = useState<
    Awaited<ReturnType<typeof getProviders>> | []
  >([]);

  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };

    fetchProviders();
  }, []);

  const handleSignInWithProvider = async (providerId: string) => {
    console.log(router.pathname, router.asPath);
    await signIn(providerId, {
      callbackUrl: `/auth_callback/?redirectUrl=${router.asPath}`,
    });
  };

  return (
    <div>
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <Button
              onClick={() => handleSignInWithProvider(provider.id)}
              className="px-8 py-6 tracking-widest uppercase font-thin"
            >
              Sign in with {provider.name}
            </Button>
          </div>
        ))}
    </div>
  );
};

export default SignInForm;
