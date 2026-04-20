import { z } from "zod"

export const passwordSchema = z
  .string("Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .describe("User password (Minimum 8 characters, 1 letter, 1 number)")

const emailSchema = z
  .email("The email must be a valid email address")
  .describe("User email address")

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const defaultLoginValues: LoginSchema = {
  email: "",
  password: "",
  rememberMe: false,
}
