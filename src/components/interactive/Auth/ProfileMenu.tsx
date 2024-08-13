import { Separator } from "@/components/my-ui/separator";
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
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import ConfirmationPrompt from "../Prompts/ConfirmationPrompt";
import AuthCard from "./AuthCard";

interface IProps {}

const ProfileMenu: FC<IProps> = () => {
  const [error, setError] = useState<NextAuthError | null>(null);
  const router = useRouterWithHelpers();
  const { t } = useTranslation("");
  const { data: userData } = useSession();
  const deleteAccount = api.user.deleteUserAndAccountsByUserId.useMutation();
  const unlinkSpotifyAccount = api.user.unlinkSpotifyAccount.useMutation();

  const { data: spotifyAccount } = api.account.getSpotifyAccountById.useQuery(
    { userId: userData?.user.id! },
    {
      refetchOnWindowFocus: false,
      enabled: !!userData,
    },
  );

  // Check for errors in URL
  useEffect(() => {
    const errorParams = router.getParams("error");
    if (!errorParams) return;

    if (isNextAuthError(errorParams)) {
      setError(errorParams);
      router.setParams({ disableAnimation: "true" });
    }
  }, [router.isReady]);

  const signOutText = t("auth.signOut");
  const logoutLoadingText = t("toast.logout.loading");
  const logoutSuccessText = t("toast.logout.success");
  const logoutErrorText = t("toast.logout.error");

  const userMailText = t("general.mail");
  const spotifyText = "Spotify";
  const spotifyConnectedText = t("search.settings.spotifyConnected");
  const spotifyConnectPrompt = t("search.spotify.connectPromptSm");
  const unlinkSpotifyPromptTitle = t("search.settings.unlink.title");
  const unlinkSpotifyPromptText = t("search.settings.unlink.text");
  const unlinkSpotifyLoadingText = t("toast.unlinkSpotify.loading");
  const unlinkSpotifySuccessText = t("toast.unlinkSpotify.success");
  const unlinkSpotifyErrorText = t("toast.unlinkSpotify.error");

  const getNextAuthErrorText = (errorString: string) => t(`auth.errors.${errorString}`);

  const haveFeedbackText = t("profile.haveFeedback");
  const writeUsPrompt = t("profile.writeUs");
  const wantToGoText = t("profile.wantToGo");
  const logOutText = t("profile.logout");

  const deleteAccountText = t("profile.deleteAccount.button");
  const deleteAccountPromptTitle = t("profile.deleteAccount.promptTitle");
  const deleteAccountPromptText = t("profile.deleteAccount.promptText");
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
      { userId: userData.user.id },
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

  const handleUnlinkSpotify = async () => {
    if (!userData) {
      throw new Error("User must be logged in to request account deletion.");
    }

    const loadingToast = toast.loading(unlinkSpotifyLoadingText);
    unlinkSpotifyAccount.mutate(
      { userId: userData.user.id },
      {
        onSuccess: () => {
          toast.success(unlinkSpotifySuccessText, { id: loadingToast });
        },
        onError: () => {
          toast.error(unlinkSpotifyErrorText, { id: loadingToast });
        },
      },
    );
  };

  if (!userData)
    return (
      <Button onClick={handleSignOut} className="px-8 py-6 font-thin uppercase tracking-widest">
        <p>{signOutText}</p>
      </Button>
    );

  const userName = userData.user.name;
  const userMail = userData.user.email;
  const userImg = userData.user.image;
  const userImgAlt = `Avatar image of ${userName}`;

  return (
    <AuthCard size="default">
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
          <div className="flex items-center justify-between gap-2">
            <p className="text-success">{spotifyConnectedText}</p>
            <div className="flex gap-2">
              <a
                href={`https://open.spotify.com/user/${spotifyAccount.providerAccountId}`}
                target="_blank"
              >
                <IconButton icon="external" variant="ghostSuccess" size="icon" iconSize="22px" />
              </a>
              <ConfirmationPrompt
                dialogAction={handleUnlinkSpotify}
                dialogText={unlinkSpotifyPromptText}
                dialogTitle={unlinkSpotifyPromptTitle}
              >
                <IconButton icon="x" variant="ghostDestructive" size="icon" iconSize="22px" />
              </ConfirmationPrompt>
            </div>
          </div>
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
        <ConfirmationPrompt
          dialogAction={handleDeleteAccount}
          dialogText={deleteAccountPromptText}
          dialogTitle={deleteAccountPromptTitle}
        >
          <IconButton text={deleteAccountText} variant="ghostDestructive" size="sm" icon="x" />
        </ConfirmationPrompt>
      </div>

      {/* Log out */}
      <Separator borderColor="border-background" />
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
