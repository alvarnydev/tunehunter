import { LogIn, User, X } from "lucide-react";
import { Button } from "../ui/button";
import ProfileModal from "../modals/ProfileModal";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ProfileBackground from "../ProfileBackground";
import { useSession } from "next-auth/react";

const ProfileButton = () => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    if (profileModalOpen && !isLoggedIn) setProfileModalOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleProfileButtonClick = async () => {
    setProfileModalOpen((open) => !open);
  };

  return (
    <>
      <ProfileModal open={profileModalOpen} />
      <ProfileBackground open={profileModalOpen} />
      <Button
        variant="primary"
        size="icon"
        className={"z-10 w-12 h-12 relative"}
        onClick={handleProfileButtonClick}
      >
        <User
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[1.6rem] w-[1.6rem] transition-all duration-500",
            profileModalOpen ? "-rotate-90 scale-0" : "rotate-0 scale-100",
          )}
        />

        <X
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[1.6rem] w-[1.6rem] transition-all duration-500",
            profileModalOpen ? "rotate-0 scale-100" : "rotate-90 scale-0",
          )}
        />
      </Button>
    </>
  );
};

export default ProfileButton;
