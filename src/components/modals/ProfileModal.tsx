import { wait } from "@/helpers/wait";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { type FC } from "react";
import { toast } from "sonner";
import SignInForm from "../interactive/SignInForm";
import { Button } from "../ui/button";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ProfileModal: FC<IProps> = ({ open, setOpen }) => {
  const { status, data: sessionData } = useSession();
  const isLoggedIn = status === "authenticated";
  console.log("sessionData", sessionData);

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
    <div
      className={cn(
        "z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center menu-transition",
        open
          ? "opacity-100 delay-100"
          : "opacity-0 delay-0 pointer-events-none",
      )}
    >
      {isLoggedIn ? (
        <div className="flex flex-col gap-4">
          <p className="text-center text-2xl">
            {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
          </p>
          <Button
            onClick={handleSignOut}
            className="px-8 py-6 tracking-widest uppercase font-thin"
          >
            <p>Sign out</p>
          </Button>
        </div>
      ) : (
        <SignInForm />
      )}
    </div>
  );
};
export default ProfileModal;
