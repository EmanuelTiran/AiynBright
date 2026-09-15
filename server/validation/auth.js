import "server-only";
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.")
  .max(254, "The email address is too long.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Enter your password.")
    .refine((value) => value.trim().length > 0, "Enter your password.")
    .max(128, "The password is too long."),
});

export const registrationSchema = z.object({
  username: z
    .string()
    .trim()
    .min(
      2,
      "The name must contain at least 2 characters.",
    )
    .max(
      50,
      "The name can contain at most 50 characters.",
    ),

  email: emailSchema,

  password: z
    .string()
    .min(
      8,
      "The password must contain at least 8 characters.",
    )
    .max(
      128,
      "The password can contain at most 128 characters.",
    )
    .regex(
      /[a-zA-Z]/,
      "The password must contain a letter.",
    )
    .regex(
      /[0-9]/,
      "The password must contain a number.",
    ),
});

export function firstValidationError(result) {
  return (
    result.error?.issues?.[0]?.message ||
    "The submitted data is invalid."
  );
}
