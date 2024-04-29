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

  const userNameText = t("general.userName");
  const userMailText = t("general.mail");
  const spotifyConnectedText = t("settings.spotifyConnected");
  const soundsAllowedText = t("settings.soundsAllowed");
  const haveFeedbackText = t("settings.haveFeedback");
  const writeUsPrompt = t("settings.writeUs");

  return (
    <div className="overflow-y-auto rounded-[2rem] bg-background p-10 ">
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar>{userImg && <AvatarImage src={userImg} alt={userImgAlt} />}</Avatar>
        </div>
        <div className="grid w-full grid-cols-2 gap-4">
          <p className="font-thin">{userNameText}</p>
          <p>{userName}</p>
          <p className="font-thin">{userMailText}</p>
          <p>{userMail}</p>
        </div>
        <Separator borderColor="border-foreground" />
        <div className="grid w-full grid-cols-2 gap-4">
          <p className="font-thin">{soundsAllowedText}</p>
          <Switch checked={allowSounds} onCheckedChange={setAllowSounds} />
          <p className="flex items-center font-thin">{spotifyConnectedText}</p>
          {/* <IconButton
            icon="tick"
            text="Connected"
            disabled
            sizeVariant="sm"
            buttonVariant="accent"
            iconVariant="accent-foreground"
          /> */}
          <IconButton
            icon="spotify"
            text="Connect"
            sizeVariant="sm"
            buttonVariant="primary"
            iconVariant="primary-foreground"
          />
        </div>
        <Separator borderColor="border-foreground" />
        <div className="grid w-full grid-cols-2 gap-4">
          <p className="flex items-center font-thin">{haveFeedbackText}</p>
          <IconButton sizeVariant="sm" className="justify-self-start" icon="mail">
            <a href="mailto:hello@tunehunter.app">{writeUsPrompt}</a>
          </IconButton>
        </div>
        <div className="mt-2" />
        <IconButton
          onClick={handleSignOut}
          text={signOutText}
          iconVariant="destructive-foreground"
          buttonVariant="destructive"
          sizeVariant="lg"
          icon="signOut"
        />
      </div>
    </div>
  );
};

export default ProfileMenu;
