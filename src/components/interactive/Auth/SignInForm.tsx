import { Separator } from "@/components/my-ui/separator";
import { Input } from "@/components/ui/input";
import { isCustomIcon } from "@/helpers/custom-icons";
import { type Providers } from "@/interfaces/providers";
import { api } from "@/utils/api";
import { getProviders, signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState, type FC, type FormEvent } from "react";
import { toast } from "sonner";
import { MenuState } from "../AuthMenu";
import IconButton from "../IconButton";

interface IProps {
  email: string;
  setEmail: (email: string) => void;
  setMenuState: (menuState: MenuState) => void;
}

const SignInForm: FC<IProps> = ({ email, setEmail, setMenuState }) => {
  const { t } = useTranslation("");
  const [providers, setProviders] = useState<Providers>();
  const router = useRouter();
  // const userQuery = api.user.getUser.useQuery({ email }, { enabled: true });
  const utils = api.useUtils();

  useEffect(() => {
    const fetchProviders = async () => {
      const resProviders = await getProviders();
      if (!resProviders) return;
      setProviders(resProviders);
    };

    fetchProviders();
  }, []);

  if (!providers) {
    return <></>;
  }

  const OAuthProviders = [providers.spotify];
  const orText = t("general.or");
  const signInWithMailText = t("auth.signInWithEmail");
  const signInWithProviderText = (provider: string) => t("auth.signInWithProvider", { provider });

  const mailSendLoadingText = t("auth.toast.login.mail.loading");
  const mailSendErrorText = t("auth.toast.login.mail.error");
  const mailSendSuccessText = t("auth.toast.login.mail.success");

  const handleSignInWithProvider = async (providerId: string) => {
    // Remove ?profile from URL
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.delete("profile");
    url.search = params.toString();
    const redirectPath = url.pathname + url.search;

    const callbackUrl = `/${router.locale}/auth_callback/?redirectUrl=${redirectPath}`;
    await signIn(providerId, { callbackUrl });
  };

  const handleSignInWithEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const user = await utils.user.getUserByEmail.fetch({ email });
    // use mutation "register" and check result

    // New user -> Register
    if (!user) {
      setMenuState(MenuState.Register);
      return;
    }

    // Existing user -> Magic Link
    const signInPromise = signIn("email", { email, redirect: false });
    const mailSentPromise = new Promise((resolve, reject) => {
      signInPromise
        .then((response) => {
          if (response?.error) {
            reject(response);
          } else {
            resolve(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
    toast.promise(mailSentPromise, {
      loading: mailSendLoadingText,
      success: () => {
        setMenuState(MenuState.MagicLinkSent);
        return mailSendSuccessText;
      },
      error: mailSendErrorText,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-4" onSubmit={handleSignInWithEmail}>
        <Input
          type="email"
          placeholder="xyz@gmail.com"
          className="border-bac placeholder:text-foreground/50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <IconButton
          type="submit"
          text={signInWithMailText}
          disabled={!email}
          icon="mail"
          size="lg"
        />
      </form>
      <Separator borderColor="border-foreground">
        <p className="px-2 text-xs uppercase">{orText}</p>
      </Separator>
      {OAuthProviders &&
        Object.values(OAuthProviders).map((provider, index) => (
          <div key={provider?.id ?? index}>
            <IconButton
              icon={isCustomIcon(provider.id) ? provider.id : "fallback"}
              text={signInWithProviderText(provider.name)}
              size="lg"
              onClick={() => provider?.id && handleSignInWithProvider(provider.id)}
            />
          </div>
        ))}
    </div>
  );
};

export default SignInForm;
