import useRouterWithHelpers from "@/hooks/useRouterWithHelpers";
import { cn } from "@/lib/utils";
import { User, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ProfileBackground from "../ProfileBackground";
import ProfileModal from "../modals/ProfileModal";
import { Button } from "../ui/button";

const ProfileButton = () => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const router = useRouterWithHelpers();
  const { status } = useSession();

  const openProfileModal = () => {
    setProfileModalOpen(true);
    router.setParams({ profile: status === "authenticated" ? "settings" : "login" });
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
    router.setParams({ profile: "" });
  };

  const toggleProfileModal = () => {
    if (profileModalOpen) closeProfileModal();
    else openProfileModal();
  };

  useEffect(() => {
    if (router.isReady && router.getParams("profile")) {
      setProfileModalOpen(true);
    }
  }, [router.isReady]);

  return (
    <>
      <ProfileModal open={profileModalOpen} closeModal={closeProfileModal} />
      <ProfileBackground open={profileModalOpen} />
      <Button
        variant="primary"
        size="lg"
        className={cn(
          "menu-transition relative z-10 w-20",
          profileModalOpen ? "bg-background text-foreground hover:bg-background/80" : "",
        )}
        onClick={toggleProfileModal}
      >
        <User
          className={cn(
            "menu-transition absolute left-1/2 top-1/2 h-[1.6rem] w-[1.6rem] -translate-x-1/2 -translate-y-1/2 transform",
            profileModalOpen ? "-rotate-90 scale-0" : "rotate-0 scale-100",
          )}
        />
        <X
          className={cn(
            "menu-transition absolute left-1/2 top-1/2 h-[1.6rem] w-[1.6rem] -translate-x-1/2 -translate-y-1/2 transform",
            profileModalOpen ? "rotate-0 scale-100" : "rotate-90 scale-0",
          )}
          strokeWidth="1px"
        />
      </Button>
    </>
  );
};

export default ProfileButton;
