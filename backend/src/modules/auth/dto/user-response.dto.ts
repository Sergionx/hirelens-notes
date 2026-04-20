import z from 'zod';
import { createZodDto } from 'nestjs-zod';

import { stringToDateTime } from '@/schemas/codecs/isoToDateCodec';
import { createMessageResponse } from '@/schemas/common/messageResponse';

export const userSchema = z.object({
  id: z.number().describe('User ID'),
  email: z.email().describe('User email address'),
  nickname: z.string().describe('User nickname'),
  createdAt: stringToDateTime,
  updatedAt: stringToDateTime,
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
