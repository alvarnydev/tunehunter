import { playJingle } from "@/helpers/play-jingle";
import { signInWithProvider } from "@/helpers/sign-in";
import { wait } from "@/helpers/wait";
import useRouterWithHelpers from "@/hooks/useRouterWithHelpers";
import { api } from "@/utils/api";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { type FC } from "react";
import { toast } from "sonner";
import IconButton from "../../IconButton";
import { Separator } from "../../my-ui/separator";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import AuthCard from "./AuthCard";

interface IProps {
  closeModal: () => void;
}

const ProfileMenu: FC<IProps> = ({ closeModal }) => {
  const { data: sessionData } = useSession();
  const router = useRouterWithHelpers();
  const { t } = useTranslation("");
  const { data: userData } = useSession();
  const { data: spotifyAccount } = api.account.getSpotifyAccountById.useQuery(
    { userId: userData?.user.id! },
    {
      refetchOnWindowFocus: false,
      enabled: !!userData,
    },
  );

  const signOutText = t("auth.signOut");
  const logoutLoadingText = t("auth.toast.logout.loading");
  const logoutSuccessText = t("auth.toast.logout.success");
  const logoutErrorText = t("auth.toast.logout.error");

  const handleSignOut = async () => {
    closeModal();
    playJingle("reverse");

    toast.promise(
      wait(500)
        .then(() => signOut({ redirect: false }))
        .then(() => router.setParams({ search: "" })),
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
    console.log("deleting account");
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

  const userNameText = t("general.userName");
  const userMailText = t("general.mail");

  const settingsText = t("profile.settings.label");
  const spotifyText = "Spotify";
  const spotifyConnectedText = t("profile.settings.spotifyConnected");
  const spotifyConnectPrompt = t("search.spotify.connectPromptSm");
  const soundsAllowedText = t("profile.settings.soundsAllowed");

  const actionsText = t("profile.actions.label");
  const haveFeedbackText = t("profile.actions.haveFeedback");
  const writeUsPrompt = t("profile.actions.writeUs");
  const wantToGoText = t("profile.actions.wantToGo");
  const deleteAccountText = t("profile.actions.deleteAccount");
  const logOutText = t("profile.actions.logout");

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

      <div className="grid w-full grid-cols-2 gap-4">
        <p className="break-words font-thin">{userMailText}</p>
        <p className="overflow-x-clip text-ellipsis">{userMail}</p>
        <p className="flex items-center font-thin">{spotifyText}</p>
        {spotifyAccount && (
          <p className="overflow-x-clip text-ellipsis text-success">{spotifyConnectedText}</p>
        )}
        {!spotifyAccount && (
          <IconButton
            icon={"spotify"}
            variant="primary"
            text={spotifyConnectPrompt}
            size="sm"
            onClick={() => signInWithProvider("spotify", router.locale ?? "")}
          />
        )}
      </div>

      {/* Actions */}
      <div className="mb-[1px] mt-[2px]" />
      <div className="grid w-full grid-cols-2 gap-4">
        <p className="flex items-center font-thin">{haveFeedbackText}</p>
        <IconButton size="xs" className="" icon="mail" variant="primary">
          <a
            className="pl-1 font-light uppercase tracking-widest"
            href="mailto:hello@tunehunter.app?subject=Feedback"
          >
            {writeUsPrompt}
          </a>
        </IconButton>

        <p className="flex items-center font-thin">{wantToGoText}</p>
        <IconButton
          onClick={handleDeleteAccount}
          text={deleteAccountText}
          variant="ghostDestructive"
          size="xs"
          icon="x"
        />
      </div>

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
