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

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full">{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>dialogTitle</AlertDialogTitle>
          <AlertDialogDescription>dialogText</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("general.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleChangeAvatar}>{t("general.confirm")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChangeAvatarDialog;
