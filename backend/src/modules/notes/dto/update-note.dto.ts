import z from 'zod';
import { createZodDto } from 'nestjs-zod';

import { noteResponseSchema } from './note-response.dto';

const updateNoteSchema = noteResponseSchema.partial().pick({
  title: true,
  content: true,
  isArchived: true,
}).extend({
  categoryIds: z.array(z.number()).optional()
});

export class UpdateNoteDto extends createZodDto(updateNoteSchema) {}
