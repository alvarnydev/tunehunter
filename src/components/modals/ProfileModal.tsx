import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { type FC } from "react";
import ProfileMenu from "../interactive/ProfileMenu";
import SignInForm from "../interactive/SignInForm";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ProfileModal: FC<IProps> = ({ open, setOpen }) => {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <div
      className={cn(
        "z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center menu-transition",
        open
          ? "opacity-100 delay-100"
          : "opacity-0 delay-0 pointer-events-none",
      )}
    >
      {isLoggedIn ? <ProfileMenu setOpen={setOpen} /> : <SignInForm />}
    </div>
  );
};
export default ProfileModal;
