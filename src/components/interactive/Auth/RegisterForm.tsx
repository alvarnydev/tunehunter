import { Separator } from "@/components/my-ui/separator";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, type FC } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type z } from "zod";
import { MenuState } from "../AuthMenu";
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
  // const createAccount = api.user.createAccount.useMutation();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
    },
  });
  form.setValue("email", email);

  const registerText = t("auth.register");
  const returnText = t("auth.returnToSignIn");

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    console.log(values, "values");
    setError("");
    setSuccess("");
    // startTransition(() => {
    //   createAccount.mutate(
    //     { values },
    //     { onSuccess: (data) => setSuccess(data.success), onError: (data) => setError(data.error) },
    //   );
    // });
  };

  return (
    <div className="overflow-y-auto rounded-[2rem] bg-background px-6 py-6 md:px-8 md:py-6 lg:px-10 lg:py-8 ">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <p>We did not find an account to your email. </p>
          <p>Please register using the form below!</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="john.doe@example.com"
                        type="email"
                        disabled={isPending}
                        className="border-2 border-primary pr-14 text-lg placeholder:text-muted-foreground focus-visible:ring-primary"
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
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="TrebleMaker"
                        type="text"
                        disabled={isPending}
                        className="border-2 border-primary pr-14 text-lg placeholder:text-muted-foreground focus-visible:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Separator borderColor="border-foreground" />
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
      </div>
    </div>
  );
};

export default RegisterForm;
