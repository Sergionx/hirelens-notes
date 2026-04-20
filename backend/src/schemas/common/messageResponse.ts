import { z } from 'zod';

export function createMessageResponse<T extends z.ZodTypeAny>(
  schema: T,
  message: string = 'Success',
) {
  return z.object({
    message: z.string().default(message),
    data: schema,
  });
}


