import { Button } from "@/components/ui/button";
import { getProviders, signIn } from "next-auth/react";
import { type FC, useEffect, useState } from "react";

const SignInForm: FC = ({}) => {
  const [providers, setProviders] = useState<
    Awaited<ReturnType<typeof getProviders>> | []
  >([]);

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };

    fetchProviders();
  }, []);

  return (
    <div>
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <Button
              variant="outline"
              onClick={() => signIn(provider.id)}
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
