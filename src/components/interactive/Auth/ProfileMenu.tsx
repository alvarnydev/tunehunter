import { playJingle } from "@/helpers/play-jingle";
import { wait } from "@/helpers/wait";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useState, type FC } from "react";
import { toast } from "sonner";
import IconButton from "../../IconButton";
import { Separator } from "../../my-ui/separator";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Switch } from "../../ui/switch";
import AuthCard from "./AuthCard";

interface IProps {
  closeModal: () => void;
}

const ProfileMenu: FC<IProps> = ({ closeModal }) => {
  const { data: sessionData } = useSession();
  const { t } = useTranslation("");
  const [allowSounds, setAllowSounds] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  const signOutText = t("auth.signOut");
  const logoutLoadingText = t("auth.toast.logout.loading");
  const logoutSuccessText = t("auth.toast.logout.success");
  const logoutErrorText = t("auth.toast.logout.error");

  const handleSignOut = async () => {
    closeModal();
    if (allowSounds) playJingle("reverse");

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
  const spotifyConnectedText = t("profile.settings.spotifyConnected");
  const soundsAllowedText = t("profile.settings.soundsAllowed");

  const actionsText = t("profile.actions.label");
  const haveFeedbackText = t("profile.actions.haveFeedback");
  const writeUsPrompt = t("profile.actions.writeUs");
  const wantToGoText = t("profile.actions.wantToGo");
  const deleteAccountText = t("profile.actions.deleteAccount");
  const logOutText = t("profile.actions.logout");

  return (
    <AuthCard label="" size="big">
      {/* User */}
      <div className="flex flex-col items-center gap-4">
        <Avatar>
          {userImg && <AvatarImage src={userImg} alt={userImgAlt} />}
          {!userImg && <AvatarImage src="/favicons/android-chrome-192x192.png" alt={userImgAlt} />}
        </Avatar>
      </div>

      <div className="grid w-full grid-cols-2 gap-4">
        {userName && (
          <>
            <p className="font-thin">{userNameText}</p>
            <p>{userName}</p>
          </>
        )}
        <p className="break-words font-thin">{userMailText}</p>
        <p className="overflow-x-clip text-ellipsis">{userMail}</p>
      </div>

      {/* Settings */}
      <div className="mb-[1px] mt-[2px]" />
      <Separator borderColor="border-foreground">
        <p className="px-2 text-sm uppercase">{settingsText}</p>
      </Separator>
      <div className="grid w-full grid-cols-2 gap-4">
        <p className="flex items-center font-thin">{soundsAllowedText}</p>
        <div className="flex h-8 items-center">
          <Switch checked={allowSounds} onCheckedChange={setAllowSounds} />
        </div>
        <p className="flex items-center font-thin">{spotifyConnectedText}</p>
        <div className="flex h-8 items-center">
          <Switch checked={spotifyConnected} onCheckedChange={setSpotifyConnected} />
        </div>
      </div>

      {/* Actions */}
      <div className="mb-[1px] mt-[2px]" />
      <Separator borderColor="border-foreground">
        <p className="px-2 text-sm uppercase">{actionsText}</p>
      </Separator>
      <div className="grid w-full grid-cols-2 gap-4">
        <p className="flex items-center font-thin">{haveFeedbackText}</p>
        <IconButton size="xs" className="justify-self-start" icon="mail" variant="primary">
          <a href="mailto:hello@tunehunter.app?subject=Feedback">{writeUsPrompt}</a>
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

      <Separator />
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
