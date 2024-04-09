import { wait } from "@/helpers/wait";
import { signOut, useSession } from "next-auth/react";
import { type FC } from "react";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface IProps {
  setOpen: (open: boolean) => void;
}

const ProfileMenu: FC<IProps> = ({ setOpen }) => {
  const { data: sessionData } = useSession();

  const handleSignOut = async () => {
    setOpen(false);

    toast.promise(
      wait(500).then(() => signOut({ redirect: false })),
      {
        loading: "Logging out...",
        success: () => {
          return "Successfully logged out";
        },
        error: "Error",
      },
    );
  };

  if (!sessionData)
    return (
      <Button onClick={handleSignOut} className="px-8 py-6 font-thin uppercase tracking-widest">
        <p>Sign out</p>
      </Button>
    );

  const userName = sessionData.user.name;
  const userMail = sessionData.user.email;
  const userImg = sessionData.user.image;
  const userImgAlt = `Avatar image of ${userName}`;

  return (
    <div className="flex flex-col items-center gap-16">
      <div className="flex flex-col items-center gap-4">
        <Avatar>{userImg && <AvatarImage src={userImg} alt={userImgAlt} />}</Avatar>
        <p className="text-2xl">{userName}</p>
        <p className="text-2xl">{userMail}</p>
      </div>
      <Button
        onClick={handleSignOut}
        variant={"destructive"}
        className="px-8 py-6 font-thin uppercase tracking-widest"
      >
        <p>Sign out</p>
      </Button>
    </div>
  );
};

export default ProfileMenu;
