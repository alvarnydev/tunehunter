import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { TokenConfirmSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useTranslation } from "next-i18next";
import { useState, useTransition, type FC } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { MenuState } from "../AuthMenu";
import AuthCard from "./AuthCard";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";

interface IProps {
  email: string;
  setMenuState: (menuState: MenuState) => void;
}

const MagicLinkForm: FC<IProps> = ({ email, setMenuState }) => {
  const { t } = useTranslation("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  // const createAccount = api.user.createAccount.useMutation();
  const form = useForm<z.infer<typeof TokenConfirmSchema>>({
    resolver: zodResolver(TokenConfirmSchema),
    defaultValues: {
      token: "",
    },
  });

  const magicLinkInfoText = t("auth.magicLink.sent", { email });
  const tokenLabel = t("auth.magicLink.token");
  const confirmTokenText = t("auth.magicLink.confirm");
  const returnText = t("auth.returnToSignIn");

  const onSubmit = (values: z.infer<typeof TokenConfirmSchema>) => {
    console.log(values, "values");
    setError("");
    setSuccess("");
    // startTransition(() => {
    //   createAccount.mutate(
    //     { values },
    //     {
    //       onSuccess: setMenuState(MenuState.MagicLinkSent),
    //       onError: (data) => setError(data.error),
    //     },
    //   );
    // });
  };

  return (
    <AuthCard label={magicLinkInfoText} size="small">
      <Form {...form}>
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
      </Form>
    </AuthCard>
  );
};

export default MagicLinkForm;
