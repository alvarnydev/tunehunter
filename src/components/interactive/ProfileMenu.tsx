import { wait } from "@/helpers/wait";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { type FC } from "react";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface IProps {
  setOpen: (open: boolean) => void;
}

const ProfileMenu: FC<IProps> = ({ setOpen }) => {
  const { data: sessionData } = useSession();
  const { t } = useTranslation("");

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

  const userNameText = t("auth.userName");
  const userMailText = t("auth.mail");

  return (
    <div className="flex w-full flex-col items-center gap-10 rounded-[2rem] bg-background p-10">
      <div className="flex flex-col items-center gap-4">
        <Avatar>{userImg && <AvatarImage src={userImg} alt={userImgAlt} />}</Avatar>
      </div>
      <Button
        onClick={handleSignOut}
        variant={"destructive"}
        className="px-8 py-6 font-thin uppercase tracking-widest"
      >
        <p>{signOutText}</p>
      </Button>
    </div>
  );
};

export default ProfileMenu;
