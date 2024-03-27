import { wait } from "@/helpers/wait";
import { signOut, useSession } from "next-auth/react";
import { type FC } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface IProps {
  setOpen: (open: boolean) => void;
}

const ProfileMenu: FC<IProps> = ({ setOpen }) => {
  const { data: sessionData } = useSession();
  const userName = sessionData?.user.name;
  const userMail = sessionData?.user.email;
  const userImg = sessionData?.user.image;

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

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-2xl font-bold">
        {sessionData && <span>Hi, {sessionData.user?.name}</span>}
      </p>
      <Button onClick={handleSignOut} className="px-8 py-6 font-thin uppercase tracking-widest">
        <p>Sign out</p>
      </Button>
    </div>
  );
};

export default ProfileMenu;
