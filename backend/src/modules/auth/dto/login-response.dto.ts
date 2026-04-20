import z from 'zod';
import { createZodDto } from 'nestjs-zod';

import { createMessageResponse } from '@/schemas/common/messageResponse';

export const tokenSchema = z.object({
  access_token: z.string().describe('JWT access token'),
});

export class AcessTokenDto extends createZodDto(tokenSchema, {
  codec: true,
}) {}

export class AcessToken_MessageDto extends createZodDto(
  createMessageResponse(tokenSchema),
  {
    codec: true,
  },
) {}
