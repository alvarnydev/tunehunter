import useRouterWithHelpers from "@/hooks/useRouterWithHelpers";
import { cn } from "@/lib/utils";
import { User, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ProfileModal from "../../modals/ProfileModal";
import { Button } from "../../ui/button";
import ProfileBackground from "../Auth/ProfileBackground";

const ProfileButton = () => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [enableModalAnimation, setEnableModalAnimation] = useState(false);
  const router = useRouterWithHelpers();
  const { status } = useSession();

  const openProfileModal = () => {
    setEnableModalAnimation(true);
    setProfileModalOpen(true);
    router.setParams({ profile: status === "authenticated" ? "settings" : "login" });
  };

  const closeProfileModal = () => {
    setEnableModalAnimation(true);
    setProfileModalOpen(false);
    router.setParams({ profile: "", callbackUrl: "", error: "", disableAnimation: "" });
  };

  const toggleProfileModal = () => {
    if (profileModalOpen) closeProfileModal();
    else openProfileModal();
  };

  // Restore user profile if "profile" param is present
  useEffect(() => {
    if (!router.isReady) return;

    // Check animation status
    if (router.getParams("disableAnimation")) {
      setEnableModalAnimation(false);
    } else {
      setEnableModalAnimation(true);
    }

    // Open modal
    if (router.getParams("profile")) {
      setProfileModalOpen(true);
    } else {
      setProfileModalOpen(false);
    }
  }, [router.isReady, router.query]);

  return (
    <>
      <ProfileModal open={profileModalOpen} enableAnimation={enableModalAnimation} />
      <ProfileBackground open={profileModalOpen} enableAnimation={enableModalAnimation} />
      <Button
        variant="primary"
        size="lg"
        className={cn(
          "menu-transition relative z-40 w-20 border-[1px] border-background",
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
