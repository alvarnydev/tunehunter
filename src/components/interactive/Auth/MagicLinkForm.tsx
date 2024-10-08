import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";
import { type FC } from "react";
import IconButton from "../../IconButton";
import AuthCard from "./AuthCard";
import { MenuState } from "./AuthMenu";

interface IProps {
  email: string;
  setMenuState: (menuState: MenuState) => void;
}

const MagicLinkForm: FC<IProps> = ({ email, setMenuState }) => {
  const { t } = useTranslation("");

  return (
    <AuthCard description={t("auth.magicLink.sent", { email })} size="small">
      <div className="flex w-full flex-col items-center gap-2">
        <a href="mailto:" className="w-full">
          <IconButton
            text={t("auth.magicLink.openMails")}
            icon="mailOpen"
            size="lg"
            variant="primary"
          />
        </a>
        <Button variant="link" onClick={() => setMenuState(MenuState.SignIn)}>
          {t("auth.returnToSignIn")}
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
