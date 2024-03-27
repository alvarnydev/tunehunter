import { cn } from "@/lib/utils";
import { User, X } from "lucide-react";
import { useState } from "react";
import ProfileBackground from "../ProfileBackground";
import ProfileModal from "../modals/ProfileModal";
import { Button } from "../ui/button";

const ProfileButton = () => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <>
      <ProfileModal open={profileModalOpen} setOpen={setProfileModalOpen} />
      <ProfileBackground open={profileModalOpen} />
      <Button
        variant="primary"
        size="lg"
        className={cn(
          "z-10 w-20 relative menu-transition",
          profileModalOpen
            ? "bg-background text-foreground hover:bg-background/80"
            : "",
        )}
        onClick={() => setProfileModalOpen((open) => !open)}
      >
        <User
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[1.6rem] w-[1.6rem] menu-transition",
            profileModalOpen ? "-rotate-90 scale-0" : "rotate-0 scale-100",
          )}
        />
        <X
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[1.6rem] w-[1.6rem] menu-transition",
            profileModalOpen ? "rotate-0 scale-100" : "rotate-90 scale-0",
          )}
          strokeWidth="1px"
        />
      </Button>
    </>
  );
};

export default ProfileButton;
