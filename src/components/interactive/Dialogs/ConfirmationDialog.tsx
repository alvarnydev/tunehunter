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
import { useTranslation } from "next-i18next";
import { MouseEventHandler, ReactNode } from "react";

interface ConfirmationPromptProps {
  children: ReactNode;
  dialogTitle: string;
  dialogText: string;
  dialogAction: MouseEventHandler<HTMLButtonElement>;
}

const ConfirmationDialog = ({
  dialogTitle,
  dialogText,
  dialogAction,
  children,
}: ConfirmationPromptProps) => {
  const { t } = useTranslation("");
  const continueText = t("general.continue");
  const cancelText = t("general.cancel");

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full">{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogText}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={dialogAction}>{continueText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
