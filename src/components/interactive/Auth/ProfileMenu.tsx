import { Separator } from "@/components/my-ui/separator";
import { useSpotifyContext } from "@/contexts/SpotifyContext";
import useAuthError from "@/hooks/useAuthErrors";
import useProfileFunctions from "@/hooks/useProfileFunctions";
import { api } from "@/utils/api";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import IconButton from "../../IconButton";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import ChangeAvatarModal from "../Modals/ChangeAvatarModal";
import ChangeMailModal from "../Modals/ChangeMailModal";
import ConfirmationModal from "../Modals/ConfirmationModal";
import AuthCard from "./AuthCard";

const ProfileMenu = () => {
  const { t } = useTranslation("");
  const [changeMailDialogOpen, setChangeMailDialogOpen] = useState(false);
  const { handleDeleteAccount, handleLinkSpotify, handleSignOut, handleUnlinkSpotify } =
    useProfileFunctions();
  const { spotifyData } = useSpotifyContext();
  const linkError = useAuthError("link");

  const { data: userData } = useSession();
  const userName = userData?.user.name;
  const userMail = userData?.user.email;
  const userImg = userData?.user.image;
  const userImgAlt = `Avatar image of ${userName}`;

  useEffect(() => {
    if (linkError) toast.error(linkError, { dismissible: true, duration: Infinity });
  }, [linkError]);

  const { data: spotifyAccount } = api.account.getSpotifyAccountById.useQuery(
    { userId: userData?.user.id! },
    {
      refetchOnWindowFocus: false,
      enabled: !!userData,
    },
  );

  if (!userData) {
    return (
      <div className="mt-4 w-fit">
        <IconButton
          onClick={handleSignOut}
          text={t("profile.logout")}
          variant="primary"
          size="lg"
          icon="signOut"
        />
      </div>
    );
  }

  return (
    <AuthCard size="default">
      {/* User */}
      <div className="relative flex flex-row items-center gap-4 pb-2 pt-2">
        <ChangeAvatarModal>
          <div className="relative">
            <motion.div
              className="absolute inset-0 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-foreground bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <IconButton icon="upload" className="h-full w-full" size="icon" iconSize="20px" />
            </motion.div>
            <Avatar className="relative z-10 border border-foreground">
              {userImg && <AvatarImage src={userImg} alt={userImgAlt} />}
              {!userImg && <AvatarFallback>{userName?.slice(0, 2)}</AvatarFallback>}
            </Avatar>
          </div>
        </ChangeAvatarModal>
        {userName && <p>{userName}</p>}
      </div>

      {/* User data */}
      <div className="grid w-full grid-cols-[repeat(5,max-content)] gap-x-8 gap-y-6">
        <p className="col-span-2 flex items-center font-thin">{t("general.mail")}</p>

        <p className="col-span-2 flex items-center overflow-x-clip text-ellipsis font-thin">
          {userMail}
        </p>
        <div className="col-span-1">
          <ChangeMailModal open={changeMailDialogOpen} setOpen={setChangeMailDialogOpen}>
            <div>
              <IconButton
                icon="edit"
                variant="ghostPrimary"
                size="icon"
                iconSize="20px"
                onClick={() => setChangeMailDialogOpen(true)}
              />
            </div>
          </ChangeMailModal>
        </div>

        <p className="col-span-2 flex items-center font-thin">{t("search.spotify.account")}</p>
        {spotifyAccount?.data && (
          <>
            <a
              href={`https://open.spotify.com/user/${spotifyAccount.data.providerAccountId}`}
              target="_blank"
              className="col-span-2"
            >
              <IconButton
                className="flex justify-start p-0 text-success"
                icon="external"
                iconPosition="right"
                variant="link"
                text={spotifyData?.profileData?.display_name}
                size="sm"
              />
            </a>
            <ConfirmationModal
              dialogAction={() => handleUnlinkSpotify(userData.user.id)}
              dialogText={t("search.settings.unlink.text", {
                accountName: spotifyData?.profileData?.display_name,
              })}
              dialogTitle={t("search.settings.unlink.title")}
            >
              <div>
                <IconButton icon="x" variant="ghostPrimary" size="icon" iconSize="20px" />
              </div>
            </ConfirmationModal>
          </>
        )}
        {!spotifyAccount?.data && (
          <div className="col-span-3">
            <IconButton
              icon={"spotify"}
              variant="outlinePrimary"
              text={t("search.spotify.connectPromptSm")}
              size="sm"
              onClick={handleLinkSpotify}
            />
          </div>
        )}

        {/* Actions */}
        <div className="col-span-5">
          <Separator />
        </div>
        <p className="col-span-2 flex items-center font-thin">{t("profile.haveFeedback")}</p>
        <a href="mailto:hello@tunehunter.app?subject=Feedback" className="col-span-3">
          <IconButton text={t("profile.writeUs")} variant="outlinePrimary" size="sm" icon="mail" />
        </a>

        <p className="col-span-2 flex items-center font-thin">{t("profile.wantToGo")}</p>
        <div className="col-span-3">
          <ConfirmationModal
            dialogAction={() => handleDeleteAccount(userData.user.id)}
            dialogText={t("profile.deleteAccount.promptText")}
            dialogTitle={t("profile.deleteAccount.promptTitle")}
          >
            <div>
              <IconButton
                text={t("profile.deleteAccount.button")}
                variant="outlineDestructive"
                size="sm"
                icon="x"
              />
            </div>
          </ConfirmationModal>
        </div>
      </div>

      {/* Log out */}
      <div className="mt-4 w-fit">
        <IconButton
          onClick={handleSignOut}
          text={t("profile.logout")}
          variant="primary"
          size="lg"
          icon="signOut"
        />
      </div>
    </AuthCard>
  );
};

export default ProfileMenu;
