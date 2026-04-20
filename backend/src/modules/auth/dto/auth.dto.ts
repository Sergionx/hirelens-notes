import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const passwordSchema = z
  .string('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .describe('User password (Minimum 8 characters, 1 letter, 1 number)');

const emailSchema = z
  .email('The email must be a valid email address')
  .describe('User email address');

export const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export class LoginDto extends createZodDto(LoginSchema) {}

export const RegisterSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  nickname: z
    .string()
    .min(2)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Nickname can only contain letters, numbers, underscores, and hyphens',
    )
    .describe('User nickname (Minimum 2 characters)'),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
