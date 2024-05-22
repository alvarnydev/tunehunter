import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
});

export const TokenConfirmSchema = z.object({
  token: z.string().min(1),
});
