import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({ message: "E-Mail is required" }),
  name: z.string().min(3, "Minimum 3 characters required"),
});

export const ConfirmMailSchema = z.object({
  email: z.string().email({ message: "E-Mail is required" }),
  confirmEmail: z.string().email({ message: "E-Mail is required" }),
});

export const VerificationCodeSchema = z.object({
  verificationCode: z.string().min(1, "Verification code is required"),
});
