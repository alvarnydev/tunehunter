import { Separator } from "@/components/my-ui/separator";
import { isNextAuthError } from "@/helpers/nextauth-errors";
import useProfileFunctions from "@/hooks/useProfileFunctions";
import useRouterWithHelpers from "@/hooks/useRouterWithHelpers";
import { api } from "@/utils/api";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import IconButton from "../../IconButton";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import ChangeAvatarDialog from "../Dialogs/ChangeAvatarDialog";
import ChangeMailDialog from "../Dialogs/ChangeMailDialog";
import ConfirmationDialog from "../Dialogs/ConfirmationDialog";
import AuthCard from "./AuthCard";

const ProfileMenu = () => {
  const router = useRouterWithHelpers();
  const { t } = useTranslation("");
  const [changeMailDialogOpen, setChangeMailDialogOpen] = useState(false);
  const { handleDeleteAccount, handleLinkSpotify, handleSignOut, handleUnlinkSpotify } =
    useProfileFunctions();

  const { data: userData } = useSession();
  const userName = userData?.user.name;
  const userMail = userData?.user.email;
  const userImg = userData?.user.image;
  const userImgAlt = `Avatar image of ${userName}`;

  const { data: spotifyAccount } = api.account.getSpotifyAccountById.useQuery(
    { userId: userData?.user.id! },
    {
      refetchOnWindowFocus: false,
      enabled: !!userData,
    },
  );

  // Check for errors in URL
  useEffect(() => {
    const errorParams = router.getParams("error");
    if (!errorParams) return;

    if (isNextAuthError(errorParams)) {
      const errorText = getNextAuthErrorText(errorParams);
      toast.error(errorText, { dismissible: true, duration: Infinity });
    }
  }, [router.isReady]);

  const getNextAuthErrorText = (errorString: string) => t(`auth.errors.${errorString}`);

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
        <ChangeAvatarDialog>
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
        </ChangeAvatarDialog>
        {userName && <p>{userName}</p>}
      </div>

      {/* User data */}
      <div className="grid w-full grid-cols-[repeat(5,max-content)] gap-x-8 gap-y-6">
        <p className="col-span-2 flex items-center font-thin">{t("general.mail")}</p>

        <p className="col-span-2 flex items-center overflow-x-clip text-ellipsis font-thin">
          {userMail}
        </p>
        <div className="col-span-1">
          <ChangeMailDialog open={changeMailDialogOpen} setOpen={setChangeMailDialogOpen}>
            <IconButton
              icon="edit"
              variant="ghostPrimary"
              size="icon"
              iconSize="20px"
              onClick={() => setChangeMailDialogOpen(true)}
            />
          </ChangeMailDialog>
        </div>

        <p className="col-span-2 flex items-center font-thin">Spotify</p>
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
                text={t("search.settings.spotifyConnected")}
                size="sm"
              />
            </a>
            <ConfirmationDialog
              dialogAction={() => handleUnlinkSpotify(userData.user.id)}
              dialogText={t("search.settings.unlink.text")}
              dialogTitle={t("search.settings.unlink.title")}
            >
              <IconButton icon="x" variant="ghostPrimary" size="icon" iconSize="20px" />
            </ConfirmationDialog>
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
          <ConfirmationDialog
            dialogAction={() => handleDeleteAccount(userData.user.id)}
            dialogText={t("profile.deleteAccount.promptText")}
            dialogTitle={t("profile.deleteAccount.promptTitle")}
          >
            <IconButton
              text={t("profile.deleteAccount.button")}
              variant="outlineDestructive"
              size="sm"
              icon="x"
            />
          </ConfirmationDialog>
        </div>
      </div>

      {/* Log out */}
      <div className="mt-4 w-fit">
        <IconButton
          onClick={handleSignOut}
          text={t("profile.deleteAccount.button")}
          variant="primary"
          size="lg"
          icon="signOut"
        />
      </div>
    </AuthCard>
  );
};

export default ProfileMenu;
