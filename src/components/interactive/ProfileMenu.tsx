import { playJingle } from "@/helpers/play-jingle";
import { wait } from "@/helpers/wait";
import { useLocalStorage } from "@uidotdev/usehooks";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { type FC } from "react";
import { toast } from "sonner";
import { Separator } from "../my-ui/separator";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import IconButton from "./IconButton";

interface IProps {
  setOpen: (open: boolean) => void;
}

const ProfileMenu: FC<IProps> = ({ setOpen }) => {
  const { data: sessionData } = useSession();
  const { t } = useTranslation("");
  const [allowSounds, setAllowSounds] = useLocalStorage("allowSounds", false);

  const signOutText = t("auth.signOut");
  const logoutLoadingText = t("auth.toast.logout.loading");
  const logoutSuccessText = t("auth.toast.logout.success");
  const logoutErrorText = t("auth.toast.logout.error");

  const handleSignOut = async () => {
    setOpen(false);

    toast.promise(
      wait(500).then(() => signOut({ redirect: false })),
      {
        loading: logoutLoadingText,
        success: () => {
          playJingle("reverse");
          return logoutSuccessText;
        },
        error: logoutErrorText,
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

  const orText = t("general.or");
  const userNameText = t("general.userName");
  const userMailText = t("general.mail");

  const settingsText = t("profile.settings.label");
  const spotifyText = t("profile.settings.spotify");
  const spotifyConnectedText = t("profile.settings.spotifyConnected");
  const spotifyNotConnectedText = t("profile.settings.spotifyNotConnected");
  const soundsAllowedText = t("profile.settings.soundsAllowed");

  const actionsText = t("profile.actions.label");
  const haveFeedbackText = t("profile.actions.haveFeedback");
  const writeUsPrompt = t("profile.actions.writeUs");
  const logOutText = t("profile.actions.logout");
  const deleteAccountText = t("profile.actions.deleteAccount");

  return (
    <div className="overflow-y-auto rounded-[2rem] bg-background px-6 py-6 md:px-8 md:py-6 lg:px-10 lg:py-8 ">
      <div className="flex w-full flex-col items-center gap-6">
        {/* User */}
        <div className="flex flex-col items-center gap-4">
          <Avatar>
            {userImg && <AvatarImage src={userImg} alt={userImgAlt} />}
            {!userImg && (
              <AvatarImage src="/favicons/android-chrome-192x192.png" alt={userImgAlt} />
            )}
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
          <p className="flex items-center font-thin">{spotifyText}</p>
          {/* <IconButton
            icon="tick"
            text={spotifyConnectedText}
            disabled
            sizeVariant="sm"
            buttonVariant="accent"
            iconVariant="accent-foreground"
          /> */}
          <div className="w-fit">
            <IconButton
              icon="spotify"
              text={spotifyNotConnectedText}
              sizeVariant="xs"
              buttonVariant="link"
              iconVariant="primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mb-[1px] mt-[2px]" />
        <Separator borderColor="border-foreground">
          <p className="px-2 text-sm uppercase">{actionsText}</p>
        </Separator>
        <div className="grid w-full grid-cols-2 gap-4">
          <p className="flex items-center font-thin">{haveFeedbackText}</p>
          <div className="w-fit">
            <IconButton
              sizeVariant="xs"
              className="justify-self-start"
              icon="mail"
              buttonVariant="link"
              iconVariant="primary"
            >
              <a href="mailto:hello@tunehunter.app">{writeUsPrompt}</a>
            </IconButton>
          </div>
        </div>
        <div className="flex w-fit flex-col gap-4">
          <IconButton
            onClick={handleSignOut}
            text={logOutText}
            iconVariant="primary-foreground"
            buttonVariant="primary"
            sizeVariant="lg"
            icon="signOut"
          />
          <Separator>
            <p className="px-2 text-xs uppercase">{orText}</p>
          </Separator>
          <IconButton
            onClick={handleSignOut}
            text={deleteAccountText}
            iconVariant="destructive-foreground"
            buttonVariant="destructiveGhost"
            sizeVariant="lg"
            icon="x"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;
