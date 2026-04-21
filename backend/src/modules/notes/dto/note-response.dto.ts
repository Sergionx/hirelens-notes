import z from 'zod';
import { createZodDto } from 'nestjs-zod';

import { stringToDateTime } from '@/schemas/codecs/isoToDateCodec';
import { createMessageResponse } from '@/schemas/common/messageResponse';
import { categoryResponseSchema } from '@/modules/categories/dto/category-response.dto';

export const noteResponseSchema = z.object({
  id: z.number('Note ID is required').describe('Note ID'),
  title: z
    .string('Note title is required')
    .min(1)
    .max(255)
    .describe('Note title'),
  content: z.string('Note content is required').describe('Note content'),
  isArchived: z
    .boolean('Note isArchived is required')
    .describe('Indicates if the note is archived'),
  categories: z
    .array(categoryResponseSchema)
    .or(z.any())
    .optional()
    .describe('Note categories'),
  createdAt: stringToDateTime.describe('Note creation date'),
  updatedAt: stringToDateTime.describe('Note last update date'),
});

export class NoteResponseDto extends createZodDto(noteResponseSchema) {}

export class Note_MessageDto extends createZodDto(
  createMessageResponse(noteResponseSchema),
  {
    codec: true,
  },
) {}

export const noteWithCategoriesSchema = noteResponseSchema.extend({
  categories: z
    .array(categoryResponseSchema)
    .or(z.any())
    .describe('Note categories'),
});

export class Note_MessageWithCategoriesDto extends createZodDto(
  createMessageResponse(noteWithCategoriesSchema),
  {
    codec: true,
  },
) {}

export class NotesList_MessageDto extends createZodDto(
  createMessageResponse(z.array(noteResponseSchema)),
  {
    codec: true,
  },
) {}
