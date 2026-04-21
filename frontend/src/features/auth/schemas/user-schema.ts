import z from "zod";

export const userSchema = z.object({
  id: z.number('User ID is required').describe('User ID'),
  email: z.email('User email is required').describe('User email address'),
  nickname: z.string('User nickname is required').describe('User nickname'),
  createdAt: z.iso.datetime().describe('User creation date'),
  updatedAt: z.iso.datetime().describe('User last update date'),
});

export type User = z.infer<typeof userSchema>