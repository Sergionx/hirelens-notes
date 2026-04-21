import z from 'zod';
import { createZodDto } from 'nestjs-zod';

import { noteResponseSchema } from './note-response.dto';

const createNoteSchema = noteResponseSchema.pick({
  title: true,
  content: true,
}).extend({
  categoryIds: z.array(z.number()).optional()
});

export class CreateNoteDto extends createZodDto(createNoteSchema) {}
