import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { isNextAuthError, NextAuthError } from "@/helpers/nextauth-errors";
import { playJingle } from "@/helpers/play-jingle";
import { signInWithProvider } from "@/helpers/sign-in";
import { wait } from "@/helpers/wait";
import useRouterWithHelpers from "@/hooks/useRouterWithHelpers";
import { api } from "@/utils/api";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useEffect, useState, type FC } from "react";
import { toast } from "sonner";
import IconButton from "../../IconButton";
import { Separator } from "../../my-ui/separator";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import AuthCard from "./AuthCard";

interface IProps {}

const ProfileMenu: FC<IProps> = () => {
  const { data: sessionData } = useSession();
  const [error, setError] = useState<NextAuthError | null>(null);
  const router = useRouterWithHelpers();
  const { t } = useTranslation("");
  const { data: userData } = useSession();
  const deleteAccount = api.user.deleteUserAndAccountsById.useMutation();
  const { data: spotifyAccount } = api.account.getSpotifyAccountById.useQuery(
    { userId: userData?.user.id! },
    {
      refetchOnWindowFocus: false,
      enabled: !!userData,
    },
  );

  console.log(error);
  // Check for errors in URL
  useEffect(() => {
    const errorParams = router.getParams("error");
    if (!errorParams) return;

    if (isNextAuthError(errorParams)) setError(errorParams);
  }, [router.isReady]);

  const signOutText = t("auth.signOut");
  const logoutLoadingText = t("toast.logout.loading");
  const logoutSuccessText = t("toast.logout.success");
  const logoutErrorText = t("toast.logout.error");

  const continueText = t("general.continue");
  const cancelText = t("general.cancel");

  const userMailText = t("general.mail");
  const spotifyText = "Spotify";
  const spotifyConnectedText = t("search.settings.spotifyConnected");
  const spotifyConnectPrompt = t("search.spotify.connectPromptSm");
  const getNextAuthErrorText = (errorString: string) => t(`auth.errors.${errorString}`);

  const haveFeedbackText = t("profile.haveFeedback");
  const writeUsPrompt = t("profile.writeUs");
  const wantToGoText = t("profile.wantToGo");
  const logOutText = t("profile.logout");

  const deleteAccountText = t("profile.deleteAccount.button");
  const promptTitle = t("profile.deleteAccount.promptTitle");
  const promptText = t("profile.deleteAccount.promptText");
  const deleteLoadingText = t("toast.deleteAccount.loading");
  const deleteSuccessText = t("toast.deleteAccount.success");
  const deleteErrorText = t("toast.deleteAccount.error");

  const handleSignOut = async () => {
    router.push("/");
    playJingle("reverse");

    toast.promise(
      wait(500).then(() => signOut({ redirect: false })),
      {
        loading: logoutLoadingText,
        success: () => {
          return logoutSuccessText;
        },
        error: logoutErrorText,
      },
    );
  };

  const handleDeleteAccount = async () => {
    if (!userData) {
      throw new Error("User must be logged in to request account deletion.");
    }

    const loadingToast = toast.loading(deleteLoadingText);
    deleteAccount.mutate(
      { id: userData.user.id },
      {
        onSuccess: () => {
          signOut({ redirect: false });
          router.push("/");
          playJingle("reverse");
          toast.success(deleteSuccessText, { id: loadingToast });
        },
        onError: () => {
          toast.error(deleteErrorText, { id: loadingToast });
        },
      },
    );
  };

  if (!sessionData)
    return (
      <Button onClick={handleSignOut} className="px-8 py-6 font-thin uppercase tracking-widest">
        <p>{signOutText}</p>
      </Button>
    );

  const userName = sessionData.user.name;
  const userMail = sessionData.user.email;
  const userImg = sessionData.user.image;
  const userImgAlt = `Avatar image of ${userName}`;

  return (
    <AuthCard size="big">
      {/* User */}
      <div className="flex flex-row items-center gap-4 pt-2">
        <Avatar>
          {userImg && <AvatarImage src={userImg} alt={userImgAlt} />}
          {!userImg && <AvatarImage src="/favicons/android-chrome-192x192.png" alt={userImgAlt} />}
        </Avatar>
        {userName && <p>{userName}</p>}
      </div>

      {/* User data */}
      <div className="grid w-full grid-cols-2 gap-4">
        <p className="flex items-center font-thin">{userMailText}</p>
        <p className="overflow-x-clip text-ellipsis font-thin">{userMail}</p>
        <p className="flex items-center font-thin">{spotifyText}</p>
        {spotifyAccount && (
          <a
            href={`https://open.spotify.com/user/${spotifyAccount.providerAccountId}`}
            target="_blank"
          >
            <IconButton
              icon="external"
              iconPosition="right"
              variant="outlineSuccess"
              text={spotifyConnectedText}
              size="sm"
            />
          </a>
        )}
        {!spotifyAccount && (
          <IconButton
            icon={"spotify"}
            variant="outlinePrimary"
            text={spotifyConnectPrompt}
            size="sm"
            onClick={() => signInWithProvider("spotify", router.locale ?? "")}
          />
        )}
        {error === "OAuthAccountNotLinked" && (
          <div className="col-span-2 px-4 pt-2">
            <div className="col-span-2 rounded-lg border border-info px-6 py-4 text-info">
              {getNextAuthErrorText(error)}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mb-[1px] mt-[2px]" />
      <div className="grid w-full grid-cols-2 gap-4">
        <p className="flex items-center font-thin">{haveFeedbackText}</p>
        <a href="mailto:hello@tunehunter.app?subject=Feedback">
          <IconButton text={writeUsPrompt} variant="outlinePrimary" size="sm" icon="mail" />
        </a>

        <p className="flex items-center font-thin">{wantToGoText}</p>
        <AlertDialog>
          <AlertDialogTrigger>
            <IconButton text={deleteAccountText} variant="ghostDestructive" size="sm" icon="x" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{promptTitle}</AlertDialogTitle>
              <AlertDialogDescription>{promptText}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{cancelText}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount}>{continueText}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Log out */}
      <Separator borderColor="border-foreground" />
      <div className="w-fit">
        <IconButton
          onClick={handleSignOut}
          text={logOutText}
          variant="primary"
          size="lg"
          icon="signOut"
        />
      </div>
    </AuthCard>
  );
};

export default ProfileMenu;
