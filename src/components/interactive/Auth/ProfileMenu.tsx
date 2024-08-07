import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { playJingle } from "@/helpers/play-jingle";
import { signInWithProvider } from "@/helpers/sign-in";
import { wait } from "@/helpers/wait";
import useRouterWithHelpers from "@/hooks/useRouterWithHelpers";
import { api } from "@/utils/api";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { type FC } from "react";
import { toast } from "sonner";
import IconButton from "../../IconButton";
import { Separator } from "../../my-ui/separator";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import AuthCard from "./AuthCard";

interface IProps {}

const ProfileMenu: FC<IProps> = () => {
  const { data: sessionData } = useSession();
  const router = useRouterWithHelpers();
  const { t } = useTranslation("");
  const { data: userData } = useSession();
  const deleteAccount = api.user.deleteUserAndAccountsById.useMutation();
  const { data: spotifyAccount } = api.account.getSpotifyAccountById.useQuery(
    { userId: userData?.user.id! },
    {
      refetchOnWindowFocus: false,
      enabled: !!userData,
    },
  );

  const signOutText = t("auth.signOut");
  const logoutLoadingText = t("toast.logout.loading");
  const logoutSuccessText = t("toast.logout.success");
  const logoutErrorText = t("toast.logout.error");

  const handleSignOut = async () => {
    router.push("/");
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

    deleteAccount.mutate(
      { id: userData.user.id },
      {
        onSettled: () => {
          signOut({ redirect: false });
          router.push("/");
        },
      },
    );
  };

  if (!sessionData)
    return (
      <Button onClick={handleSignOut} className="px-8 py-6 font-thin uppercase tracking-widest">
        <p>{signOutText}</p>
      </Button>
    );

  const userName = sessionData.user.name;
  const userMail = sessionData.user.email;
  const userImg = sessionData.user.image;
  const userImgAlt = `Avatar image of ${userName}`;

  const userMailText = t("general.mail");
  const spotifyText = "Spotify";
  const spotifyConnectedText = t("search.settings.spotifyConnected");
  const spotifyConnectPrompt = t("search.spotify.connectPromptSm");

  const haveFeedbackText = t("profile.haveFeedback");
  const writeUsPrompt = t("profile.writeUs");
  const wantToGoText = t("profile.wantToGo");
  const deleteAccountText = t("profile.deleteAccount");
  const logOutText = t("profile.logout");

  return (
    <AuthCard size="big">
      {/* User */}
      <div className="flex flex-row items-center gap-4 pt-2">
        <Avatar>
          {userImg && <AvatarImage src={userImg} alt={userImgAlt} />}
          {!userImg && <AvatarImage src="/favicons/android-chrome-192x192.png" alt={userImgAlt} />}
        </Avatar>
        {userName && <p>{userName}</p>}
      </div>

      <div className="grid w-full grid-cols-2 gap-4">
        <p className="flex items-center font-thin">{userMailText}</p>
        <p className="overflow-x-clip text-ellipsis font-thin">{userMail}</p>
        <p className="flex items-center font-thin">{spotifyText}</p>
        {spotifyAccount && (
          <a
            href={`https://open.spotify.com/user/${spotifyAccount.providerAccountId}`}
            target="_blank"
          >
            <IconButton
              icon="external"
              iconPosition="right"
              variant="outlineSuccess"
              text={spotifyConnectedText}
              size="sm"
            />
          </a>
        )}
        {!spotifyAccount && (
          <IconButton
            icon={"spotify"}
            variant="outlinePrimary"
            text={spotifyConnectPrompt}
            size="sm"
            onClick={() => signInWithProvider("spotify", router.locale ?? "")}
          />
        )}
      </div>

      {/* Actions */}
      <div className="mb-[1px] mt-[2px]" />
      <div className="grid w-full grid-cols-2 gap-4">
        <p className="flex items-center font-thin">{haveFeedbackText}</p>
        <a href="mailto:hello@tunehunter.app?subject=Feedback">
          <IconButton text={writeUsPrompt} variant="outlinePrimary" size="sm" icon="mail" />
        </a>

        <p className="flex items-center font-thin">{wantToGoText}</p>
        <AlertDialog>
          <AlertDialogTrigger>
            <IconButton
              // onClick={handleDeleteAccount}
              text={deleteAccountText}
              variant="ghostDestructive"
              size="sm"
              icon="x"
            />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove
                your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Separator borderColor="border-foreground" />
      <div className="w-fit">
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
