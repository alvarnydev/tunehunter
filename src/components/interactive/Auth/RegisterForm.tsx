import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterSchema } from "@/schemas";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useEffect, useState, useTransition, type FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import IconButton from "../../IconButton";
import AuthCard from "./AuthCard";
import { MenuState } from "./AuthMenu";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";

interface IProps {
  email: string;
  menuState: MenuState;
  setMenuState: (menuState: MenuState) => void;
}

const RegisterForm: FC<IProps> = ({ email, menuState, setMenuState }) => {
  const [accountCreated, setAccountCreated] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const { t } = useTranslation("");
  z.setErrorMap(makeZodI18nMap({ t }));
  const [isPending, startTransition] = useTransition();
  const createAccount = api.user.createAccount.useMutation();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: email,
      name: "",
    },
  });

  useEffect(() => {
    form.setValue("email", email);
    setError("");
    setSuccess("");
    setAccountCreated(false);
  }, [menuState]);

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createAccount.mutate(
        { ...values },
        {
          onSettled: (data) => {
            if (data?.error) setError(t(`auth.registration.process.${data.error}`));
            if (data?.success) {
              setSuccess(t(`auth.registration.process.${data.success}`));
              setAccountCreated(true);
              signIn("email", { email: values.email, redirect: false });
            }
          },
          onError: (error) => setError(error.message),
        },
      );
    });
  };

  return (
    <AuthCard title={t("auth.registration.registration")} size="small">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col space-y-6">
          <div className="flex flex-col space-y-6">
            {/* TODO: Add avatar */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-normal">{t("general.mail")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                      className="border-2 border-primary text-base placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-normal">{t("general.userName")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="TrebleMaker"
                      type="text"
                      disabled={isPending}
                      className="border-2 border-primary text-base placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />

          {!accountCreated && (
            <div className="flex flex-col items-center gap-2">
              <IconButton
                type="submit"
                text={t("auth.registration.register")}
                disabled={isPending}
                icon="signUp"
                size="default"
                variant="primary"
              />
              <Button variant="link" onClick={() => setMenuState(MenuState.SignIn)}>
                {t("auth.returnToSignIn")}
              </Button>
            </div>
          )}
          {!!accountCreated && (
            <IconButton
              text={t("general.continue")}
              onClick={() => setMenuState(MenuState.MagicLinkSent)}
              className="-mt-2 w-full"
              variant="primary"
            />
          )}
        </form>
      </Form>
    </AuthCard>
  );
};

export default RegisterForm;
