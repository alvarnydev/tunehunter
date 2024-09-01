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
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { fadeInUp } from "@/helpers/animations";
import useProfileFunctions from "@/hooks/useProfileFunctions";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { ReactNode, useState } from "react";

interface ChangeMailDialogProps {
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ChangeMailDialog = ({ children, open, setOpen }: ChangeMailDialogProps) => {
  const { t } = useTranslation("");
  const [codeSent, setCodeSent] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const { handleChangeMail } = useProfileFunctions();

  const dialogTitleText = t("profile.changeMail.dialogTitle");
  const dialogDescriptionText = t("profile.changeMail.dialogDescription");
  const newMailText = t("profile.changeMail.newMail");
  const confirmMailText = t("profile.changeMail.confirmMail");
  const codePromptText = t("profile.changeMail.codePrompt");
  const codeText = t("profile.changeMail.code");

  const confirmText = t("general.confirm");
  const continueText = t("general.continue");
  const cancelText = t("general.cancel");

  const handleDialogCancel = () => {
    setEmail("");
    setConfirmEmail("");
    setConfirmationCode("");
    setCodeSent(false);
    setOpen(false);
  };

  const handleDialogClick = () => {
    setCodeSent(true);
    // Send code
    // if (!codeSent) {
    //   setCodeSent(true);
    // }
    // // Check code
    // else {
    //   // if() return;
    //   // handleChangeMail(email)
    // }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger className="w-full">{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitleText}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescriptionText}</AlertDialogDescription>
        </AlertDialogHeader>
        <motion.div className="flex flex-col gap-8">
          <motion.div className="m-auto grid w-[90%] grid-cols-3 gap-y-4" {...fadeInUp}>
            <Label htmlFor="email" className="col-span-1 flex items-center">
              {newMailText}
            </Label>
            <Input
              id="email"
              type="email"
              className="col-span-2 border-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Label htmlFor="email" className="flex items-center">
              {confirmMailText}
            </Label>
            <Input
              id="email"
              type="email"
              className="col-span-2 border-foreground"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
            />
          </motion.div>
          {codeSent && (
            <motion.div className="my-2 flex flex-col gap-6" {...fadeInUp}>
              <p>{codePromptText}</p>
              <div className="m-auto grid w-[90%] grid-cols-3 gap-y-4">
                <Label htmlFor="email" className="col-span-1 flex items-center">
                  {codeText}
                </Label>
                <div className="col-span-2">
                  <InputOTP
                    maxLength={6}
                    value={confirmationCode}
                    onChange={(value) => setConfirmationCode(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="border-foreground" />
                      <InputOTPSlot index={1} className="border-foreground" />
                      <InputOTPSlot index={2} className="border-foreground" />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="border-foreground" />
                      <InputOTPSlot index={4} className="border-foreground" />
                      <InputOTPSlot index={5} className="border-foreground" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDialogCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDialogClick}
            disabled={
              (!codeSent && (!email || !confirmEmail || email !== confirmEmail)) ||
              (codeSent && confirmationCode.length !== 6)
            }
          >
            {codeSent ? confirmText : continueText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChangeMailDialog;
