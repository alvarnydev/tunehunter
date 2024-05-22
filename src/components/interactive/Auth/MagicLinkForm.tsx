import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";
import { type FC } from "react";
import { MenuState } from "../AuthMenu";
import IconButton from "../IconButton";
import AuthCard from "./AuthCard";

interface IProps {
  email: string;
  setMenuState: (menuState: MenuState) => void;
}

const MagicLinkForm: FC<IProps> = ({ email, setMenuState }) => {
  const { t } = useTranslation("");

  const magicLinkInfoText = t("auth.magicLink.sent", { email });
  const openMailsText = t("auth.magicLink.openMails");
  const returnText = t("auth.returnToSignIn");

  return (
    <AuthCard label={magicLinkInfoText} size="small">
      <div className="flex w-full flex-col items-center gap-2">
        <a href="mailto:" className="w-full">
          <IconButton text={openMailsText} icon="mailOpen" size="lg" variant="primary" />
        </a>
        <Button variant="link" onClick={() => setMenuState(MenuState.SignIn)}>
          {returnText}
        </Button>
      </div>
    </AuthCard>
  );
};

export default MagicLinkForm;

{
  /* <Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col space-y-6">
  <div className="space-y-4">
    <FormField
      control={form.control}
      name="token"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
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
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
  <FormError message={error} />
  <FormSuccess message={success} />
  <div className="flex flex-col items-center gap-2">
    <Button type="submit" className="w-full" variant="primary" disabled={isPending}>
      {confirmTokenText}
    </Button>
    <Button variant="link" onClick={() => setMenuState(MenuState.SignIn)}>
      {returnText}
    </Button>
  </div>
</form>
</Form> */
}
