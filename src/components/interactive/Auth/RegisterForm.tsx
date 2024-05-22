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

const RegisterForm: FC<IProps> = ({ email, setMenuState }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const { t } = useTranslation("");
  const [isPending, startTransition] = useTransition();
  const createAccount = api.user.createAccount.useMutation();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
    },
  });
  // form.setValue("email", email);

  const registerText = t("auth.register");
  const returnText = t("auth.returnToSignIn");
  const registerPrompt = t("auth.registerPrompt");
  const usernameText = t("general.userName");
  const mailText = t("general.mail");

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    console.log(values, "values");
    setError("");
    setSuccess("");
    startTransition(() => {
      createAccount.mutate(
        { ...values },
        {
          onSuccess: () => setMenuState(MenuState.MagicLinkSent),
          // onError: (data) => setError(data.error),
        },
      );
    });
  };

  return (
    <AuthCard label={registerPrompt} size="small">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col space-y-6">
          <div className="space-y-4">
            {/* TODO: Add avatar */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{mailText}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                      disabled={isPending}
                      className="border-2 border-primary placeholder:text-muted-foreground focus-visible:ring-primary"
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
                  <FormLabel>{usernameText}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="TrebleMaker"
                      type="text"
                      disabled={isPending}
                      className="border-2 border-primary placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
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
              {registerText}
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

export default RegisterForm;
