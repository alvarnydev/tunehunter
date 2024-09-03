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
import useVerificationToken from "@/helpers/verification-token";
import useProfileFunctions from "@/hooks/useProfileFunctions";
import { api } from "@/utils/api";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

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
  const { createAndSendVerificationToken, verifyVerificationToken } = useVerificationToken();
  const utils = api.useUtils();

  const handleDialogCancel = () => {
    setEmail("");
    setConfirmEmail("");
    setConfirmationCode("");
    setCodeSent(false);
    setOpen(false);
  };

  const handleDialogClick = async () => {
    // Send code per mail
    if (!codeSent) {
      // Check if mail is already in use
      const account = await utils.user.getUserByEmail.fetch({ email });
      if (account) {
        toast.error(t("toast.edit.mail.alreadyExists"), { dismissible: true, duration: Infinity });
        return;
      }

      toast.dismiss();
      createAndSendVerificationToken(email);
      setCodeSent(true);

      return;
    }

    // Check code
    const codeMatchesHash = await verifyVerificationToken(email, confirmationCode);
    if (!codeMatchesHash) {
      toast.error(t("toast.edit.invalidCode"), { dismissible: true, duration: Infinity });
      return;
    }

    // Success -> change mail
    toast.dismiss();
    handleChangeMail(email);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger className="w-full">{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("profile.changeMail.dialogTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("profile.changeMail.dialogDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <motion.div className="flex flex-col gap-8">
          <motion.div className="m-auto grid w-[90%] grid-cols-3 gap-y-4" {...fadeInUp}>
            <Label htmlFor="email" className="col-span-1 flex items-center">
              {t("profile.changeMail.newMail")}
            </Label>
            <Input
              id="email"
              type="email"
              className="col-span-2 border-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={codeSent}
            />
            <Label htmlFor="email" className="flex items-center">
              {t("profile.changeMail.confirmMail")}
            </Label>
            <Input
              id="email"
              type="email"
              className="col-span-2 border-foreground"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              onKeyDown={(key) => key.key === "Enter" && handleDialogClick()}
              disabled={codeSent}
            />
          </motion.div>
          {codeSent && (
            <motion.div className="my-2 flex flex-col gap-6" {...fadeInUp}>
              <p>{t("profile.changeMail.codePrompt")}</p>
              <div className="m-auto grid w-[90%] grid-cols-3 gap-y-4">
                <Label htmlFor="email" className="col-span-1 flex items-center">
                  {t("profile.changeMail.code")}
                </Label>
                <div className="col-span-2">
                  <InputOTP
                    maxLength={6}
                    value={confirmationCode}
                    onChange={(value) => setConfirmationCode(value)}
                    onKeyDown={(key) =>
                      confirmationCode.length == 6 && key.key === "Enter" && handleDialogClick()
                    }
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
          <AlertDialogCancel onClick={handleDialogCancel}>{t("general.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDialogClick}
            disabled={
              (!codeSent && (!email || !confirmEmail || email !== confirmEmail)) ||
              (codeSent && confirmationCode.length !== 6)
            }
          >
            {codeSent ? t("general.confirm") : t("general.continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChangeMailDialog;
