import { User } from "lucide-react";
import { Button } from "../ui/button";
import ProfileModal from "../modals/ProfileModal";

const ProfileButton = () => {
  return (
    <>
      {/* <ProfileModal /> */}
      <Button variant="default" size="icon" className="w-12 h-12 bg-primary">
        <User />
      </Button>
    </>
  );
};

export default ProfileButton;
