import { cn } from "@/lib/utils";
import { type FC } from "react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import SignInForm from "../interactive/SignInForm";

interface IProps {
  open: boolean;
}

const ProfileModal: FC<IProps> = ({ open }) => {
  const { status, data: sessionData } = useSession();
  const isLoggedIn = status === "authenticated";

  const handleSignOut = async () => {
    // toast.promise(signOut({ redirect: false }), {
    //   loading: "Logging out...",
    //   success: () => {
    //     return "Successfully logged out";
    //   },
    //   error: "Error",
    // });
    signOut({ redirect: false });
  };

  return (
    <div
      className={cn(
        "z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center transition-opacity duration-500",
        open ? "opacity-100 delay-100" : "opacity-0 delay-0",
      )}
    >
      {isLoggedIn ? (
        <div className="flex flex-col gap-4">
          <p className="text-center text-2xl">
            {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
          </p>
          <Button variant="outline" onClick={handleSignOut}>
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
