import z from 'zod';
import { createZodDto } from 'nestjs-zod';

import { stringToDateTime } from '@/schemas/codecs/isoToDateCodec';
import { createMessageResponse } from '@/schemas/common/messageResponse';

export const userSchema = z.object({
  id: z.number('User ID is required').describe('User ID'),
  email: z.email('User email is required').describe('User email address'),
  nickname: z.string('User nickname is required').describe('User nickname'),
  createdAt: stringToDateTime.describe('User creation date'),
  updatedAt: stringToDateTime.describe('User last update date'),
});

export class UserResponseDto extends createZodDto(userSchema, {
  codec: true,
}) {}

export class User_MessageDto extends createZodDto(
  createMessageResponse(userSchema),
  {
    codec: true,
  },
) {}
