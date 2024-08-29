import { Separator } from "@/components/my-ui/separator";
import { isNextAuthError } from "@/helpers/nextauth-errors";
import { playJingle } from "@/helpers/play-jingle";
import { signInWithProvider } from "@/helpers/sign-in";
import { wait } from "@/helpers/wait";
import useRouterWithHelpers from "@/hooks/useRouterWithHelpers";
import { api } from "@/utils/api";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useEffect, type FC } from "react";
import { toast } from "sonner";
import IconButton from "../../IconButton";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import ConfirmationPrompt from "../Prompts/ConfirmationPrompt";
import AuthCard from "./AuthCard";

interface IProps {}

const ProfileMenu: FC<IProps> = () => {
  const router = useRouterWithHelpers();
  const { t } = useTranslation("");
  const { data: userData } = useSession();
  const utils = api.useUtils();

  const deleteAccount = api.user.deleteUserAndAccountsByUserId.useMutation();
  const unlinkSpotifyAccount = api.user.unlinkSpotifyAccount.useMutation();
  const editUserName = api.user.editUserName.useMutation();
  const editUserMail = api.user.editUserMail.useMutation();
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

  const signOutText = t("auth.signOut");
  const logoutLoadingText = t("toast.logout.loading");
  const logoutSuccessText = t("toast.logout.success");
  const logoutErrorText = t("toast.logout.error");
  const userMailText = t("general.mail");
  const spotifyText = "Spotify";
  const spotifyConnectedText = t("search.settings.spotifyConnected");
  const spotifyConnectPrompt = t("search.spotify.connectPromptSm");
  const unlinkSpotifyPromptTitle = t("search.settings.unlink.title");
  const unlinkSpotifyPromptText = t("search.settings.unlink.text");
  const unlinkSpotifyLoadingText = t("toast.unlinkSpotify.loading");
  const unlinkSpotifySuccessText = t("toast.unlinkSpotify.success");
  const unlinkSpotifyErrorText = t("toast.unlinkSpotify.error");
  const getNextAuthErrorText = (errorString: string) => t(`auth.errors.${errorString}`);
  const haveFeedbackText = t("profile.haveFeedback");
  const writeUsPrompt = t("profile.writeUs");
  const wantToGoText = t("profile.wantToGo");
  const logOutText = t("profile.logout");
  const deleteAccountText = t("profile.deleteAccount.button");
  const deleteAccountPromptTitle = t("profile.deleteAccount.promptTitle");
  const deleteAccountPromptText = t("profile.deleteAccount.promptText");
  const deleteLoadingText = t("toast.deleteAccount.loading");
  const deleteSuccessText = t("toast.deleteAccount.success");
  const deleteErrorText = t("toast.deleteAccount.error");

  const handleSignOut = async () => {
    router.push("/");
    router.setParams({ search: "" });
    playJingle("reverse");

    toast.promise(
      wait(500).then(() => signOut({ redirect: false })),
      {
        loading: logoutLoadingText,
        success: () => {
          return logoutSuccessText;
        },
        error: logoutErrorText,
      },
    );
  };

  const handleDeleteAccount = async () => {
    if (!userData) {
      throw new Error("User must be logged in to request account deletion.");
    }

    const loadingToast = toast.loading(deleteLoadingText);
    deleteAccount.mutate(
      { userId: userData.user.id },
      {
        onSuccess: () => {
          signOut({ redirect: false });
          router.push("/");
          playJingle("reverse");
          toast.success(deleteSuccessText, { id: loadingToast });
        },
        onError: () => {
          toast.error(deleteErrorText, { id: loadingToast, dismissible: true, duration: Infinity });
        },
      },
    );
  };

  const handleUnlinkSpotify = async () => {
    if (!userData) {
      throw new Error("User must be logged in to request account deletion.");
    }

    const loadingToast = toast.loading(unlinkSpotifyLoadingText);
    unlinkSpotifyAccount.mutate(
      { userId: userData.user.id },
      {
        onSuccess: () => {
          utils.account.getSpotifyAccountById
            .invalidate()
            .then(() => toast.success(unlinkSpotifySuccessText, { id: loadingToast }));
        },
        onError: () => {
          toast.error(unlinkSpotifyErrorText, {
            id: loadingToast,
            dismissible: true,
            duration: Infinity,
          });
        },
      },
    );
  };

  const handleLinkSpotify = async () => {
    await signInWithProvider("spotify", router.locale ?? "", "link");
  };

  if (!userData)
    return (
      <Button onClick={handleSignOut} className="px-8 py-6 font-thin uppercase tracking-widest">
        <p>{signOutText}</p>
      </Button>
    );

  const userName = userData.user.name;
  const userMail = userData.user.email;
  const userImg = userData.user.image;
  const userImgAlt = `Avatar image of ${userName}`;

  return (
    <AuthCard size="default">
      {/* User */}
      <div className="relative flex flex-row items-center gap-4 pb-2 pt-2">
        <div className="relative">
          <motion.div
            className="absolute inset-0 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-foreground bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <IconButton icon="edit" className="h-full w-full" size="icon" iconSize="20px" />
          </motion.div>
          <Avatar className="relative z-10 border border-foreground">
            {userImg && <AvatarImage src={userImg} alt={userImgAlt} />}
            {!userImg && <AvatarFallback>{userName?.slice(0, 2)}</AvatarFallback>}
          </Avatar>
        </div>
        {userName && <p>{userName}</p>}
      </div>

      <div className="grid w-full grid-cols-[repeat(5,max-content)] gap-x-8 gap-y-6">
        {/* User data */}
        <p className="col-span-2 flex items-center font-thin">{userMailText}</p>
        <p className="col-span-2 flex items-center overflow-x-clip text-ellipsis font-thin">
          {userMail}
        </p>
        <div className="col-span-1">
          <IconButton icon="edit" variant="ghostPrimary" size="icon" iconSize="20px" />
        </div>

        <p className="col-span-2 flex items-center font-thin">{spotifyText}</p>
        {spotifyAccount?.data && (
          <>
            <a
              href={`https://open.spotify.com/user/${spotifyAccount.data.providerAccountId}`}
              target="_blank"
              className="col-span-2"
            >
              <IconButton
                className="p-0 text-success"
                icon="external"
                iconPosition="right"
                variant="link"
                text={spotifyConnectedText}
                size="sm"
              />
            </a>
            <ConfirmationPrompt
              dialogAction={handleUnlinkSpotify}
              dialogText={unlinkSpotifyPromptText}
              dialogTitle={unlinkSpotifyPromptTitle}
            >
              <IconButton icon="x" variant="ghostPrimary" size="icon" iconSize="20px" />
            </ConfirmationPrompt>
          </>
        )}
        {!spotifyAccount?.data && (
          <div className="col-span-3">
            <IconButton
              icon={"spotify"}
              variant="outlinePrimary"
              text={spotifyConnectPrompt}
              size="sm"
              onClick={handleLinkSpotify}
            />
          </div>
        )}

        {/* Actions */}
        <div className="col-span-5">
          <Separator />
        </div>
        <p className="col-span-2 flex items-center font-thin">{haveFeedbackText}</p>
        <a href="mailto:hello@tunehunter.app?subject=Feedback" className="col-span-3">
          <IconButton text={writeUsPrompt} variant="outlinePrimary" size="sm" icon="mail" />
        </a>

        <p className="col-span-2 flex items-center font-thin">{wantToGoText}</p>
        <div className="col-span-3">
          <ConfirmationPrompt
            dialogAction={handleDeleteAccount}
            dialogText={deleteAccountPromptText}
            dialogTitle={deleteAccountPromptTitle}
          >
            <IconButton text={deleteAccountText} variant="outlineDestructive" size="sm" icon="x" />
          </ConfirmationPrompt>
        </div>
      </div>

      {/* Log out */}
      <div className="mt-4 w-fit">
        <IconButton
          onClick={handleSignOut}
          text={logOutText}
          variant="primary"
          size="lg"
          icon="signOut"
        />
      </div>
    </AuthCard>
  );
};

export default ProfileMenu;
