import { playJingle } from "@/helpers/play-jingle";
import { signInWithProvider } from "@/helpers/sign-in";
import { ErrorFormat } from "@/helpers/trpc-errors";
import { wait } from "@/helpers/wait";
import { api } from "@/utils/api";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";
import useRouterWithHelpers from "./useRouterWithHelpers";

const useProfileFunctions = () => {
  const router = useRouterWithHelpers();
  const { t } = useTranslation("");
  const { data: userData, update } = useSession();
  const utils = api.useUtils();

  const deleteAccount = api.user.deleteUserAndAccountsByUserId.useMutation();
  const unlinkSpotifyAccount = api.user.unlinkSpotifyAccount.useMutation();
  const editUserMail = api.user.editUserMail.useMutation();

  const unlinkSpotifyErrorText = (errorMessage: string) =>
    t("toast.unlinkSpotify.error", { error: errorMessage });
  const logoutLoadingText = t("toast.logout.loading");
  const logoutSuccessText = t("toast.logout.success");
  const logoutErrorText = t("toast.logout.error");
  const unlinkSpotifyLoadingText = t("toast.unlinkSpotify.loading");
  const unlinkSpotifySuccessText = t("toast.unlinkSpotify.success");
  const deleteAccountLoadingText = t("toast.deleteAccount.loading");
  const deleteAccountSuccessText = t("toast.deleteAccount.success");
  const deleteAccountErrorText = (errorMessage: string) =>
    t("toast.deleteAccount.error", { error: errorMessage });
  const editUserMailSuccessText = t("toast.edit.mail.success");
  const editUserMailErrorText = (errorMessage: string) =>
    t("toast.edit.mail.error", { error: errorMessage });

  const handleChangeMail = async (newEmail: string) => {
    if (!userData) {
      throw new Error("User must be logged in to request mail change.");
    }
    if (!newEmail) {
      toast.error("Please enter a valid email address!");
      return;
    }

    // Display error text, change colors for input, i18 strings
    editUserMail.mutate(
      { id: userData.user.id, email: newEmail },
      {
        onSuccess: () => {
          update();
          toast.dismiss();
          toast.success(editUserMailSuccessText);
        },
        onError: (opts) => {
          let errorMessage = "";

          // Internally thrown error
          try {
            const errors = JSON.parse(opts.message);
            if (Array.isArray(errors)) {
              errorMessage = (errors[0] as ErrorFormat).message;
            }
          } catch {
            // Custom errors
            errorMessage = opts.message;
          }

          toast.error(editUserMailErrorText(errorMessage), {
            dismissible: true,
            duration: Infinity,
          });
        },
      },
    );
  };

  const handleChangeAvatar = async () => {};

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

  const handleDeleteAccount = async (userId: string) => {
    if (!userData) {
      throw new Error("User must be logged in to request account deletion.");
    }

    const loadingToast = toast.loading(deleteAccountLoadingText);
    deleteAccount.mutate(
      { userId },
      {
        onSuccess: () => {
          signOut({ redirect: false });
          router.push("/");
          playJingle("reverse");
          toast.success(deleteAccountSuccessText, { id: loadingToast });
        },
        onError: (opts) => {
          const error: ErrorFormat = JSON.parse(opts.message)[0];
          const errorMessage = error.message;

          toast.error(deleteAccountErrorText(errorMessage), {
            id: loadingToast,
            dismissible: true,
            duration: Infinity,
          });
        },
      },
    );
  };

  const handleUnlinkSpotify = async (userId: string) => {
    const loadingToast = toast.loading(unlinkSpotifyLoadingText);
    unlinkSpotifyAccount.mutate(
      { userId },
      {
        onSuccess: () => {
          utils.account.getSpotifyAccountById
            .invalidate()
            .then(() => toast.success(unlinkSpotifySuccessText, { id: loadingToast }));
        },
        onError: (opts) => {
          const error: ErrorFormat = JSON.parse(opts.message)[0];
          const errorMessage = error.message;

          toast.error(unlinkSpotifyErrorText(errorMessage), {
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

  return {
    handleChangeAvatar,
    handleChangeMail,
    handleDeleteAccount,
    handleLinkSpotify,
    handleSignOut,
    handleUnlinkSpotify,
  };
};

export default useProfileFunctions;
