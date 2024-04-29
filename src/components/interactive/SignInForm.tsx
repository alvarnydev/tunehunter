import { isCustomIcon } from "@/helpers/custom-icons";
import { type Providers } from "@/interfaces/providers";
import { getProviders, signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState, type FC, type FormEventHandler } from "react";
import { toast } from "sonner";
import { Separator } from "../my-ui/separator";
import { Input } from "../ui/input";
import IconButton from "./IconButton";

const SignInForm: FC = ({}) => {
  const [providers, setProviders] = useState<Providers>();
  const [email, setEmail] = useState<string>("");
  const [magicLinkSent, setMagicLinkSent] = useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation("");

  // const mailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  // const isValidMail = mailFormat.test(email);

  const mailSendLoadingText = t("auth.toast.login.mail.loading");
  const mailSendErrorText = t("auth.toast.login.mail.error");
  const mailSendSuccessText = t("auth.toast.login.mail.success");
  const magicLinkConfirmationText = t("auth.magicLink.confirm", { email });
  const magicLinkPromptText = t("auth.magicLink.prompt");

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

  const handleSignInWithEmail: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
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
        setMagicLinkSent(true);
        return mailSendSuccessText;
      },
      error: mailSendErrorText,
    });
  };

  if (!providers) {
    return <></>;
  }

  const OAuthProviders = [providers.spotify];
  const orText = t("general.or");
  const signInWithMailText = t("auth.signInWithEmail");
  const signInWithProviderText = (provider: string) => t("auth.signInWithProvider", { provider });

  if (magicLinkSent) {
    return (
      <div className="flex flex-col items-center gap-8 ">
        <p className="text-center text-xl tracking-wide">{magicLinkConfirmationText}</p>
        <div className="w-fit">
          <IconButton icon="mailOpen">
            <a href="mailto:">{magicLinkPromptText}</a>
          </IconButton>
        </div>
      </div>
    );
  }

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
          iconVariant="foreground"
          sizeVariant="lg"
        />
      </form>
      <Separator text={orText} borderColor="border-foreground" />
      {OAuthProviders &&
        Object.values(OAuthProviders).map((provider, index) => (
          <div key={provider?.id ?? index}>
            <IconButton
              icon={isCustomIcon(provider.id) ? provider.id : "fallback"}
              text={signInWithProviderText(provider.name)}
              sizeVariant="lg"
              onClick={() => provider?.id && handleSignInWithProvider(provider.id)}
            />
          </div>
        ))}
    </div>
  );
};

export default SignInForm;
