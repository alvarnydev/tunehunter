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
import useProfileFunctions from "@/hooks/useProfileFunctions";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { ReactNode } from "react";

interface ChangeAvatarDialogProps {
  children: ReactNode;
}

const ChangeAvatarDialog = ({ children }: ChangeAvatarDialogProps) => {
  const { t } = useTranslation("");
  const { data: userData } = useSession();
  const { handleChangeAvatar } = useProfileFunctions();

  const confirmText = t("general.confirm");
  const cancelText = t("general.cancel");

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full">{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>dialogTitle</AlertDialogTitle>
          <AlertDialogDescription>dialogText</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={handleChangeAvatar}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChangeAvatarDialog;
