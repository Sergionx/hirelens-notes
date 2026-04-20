import { z } from "zod"
import { passwordSchema } from "../LoginForm/schema"

export const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email("The email must be a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type SignupSchema = z.infer<typeof signupSchema>

export const defaultSignupValues: SignupSchema = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
}
