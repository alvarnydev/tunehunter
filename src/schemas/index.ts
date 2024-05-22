import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string({ invalid_type_error: "Must be a string" }).email({
    message: "Email is required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const TokenConfirmSchema = z.object({
  token: z.string().min(1, {
    message: "Token is required",
  }),
});
