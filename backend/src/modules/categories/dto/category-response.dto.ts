import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { createMessageResponse } from '@/schemas/common/messageResponse';

export const categoryResponseSchema = z.object({
  id: z.number('Category ID is required').describe('Category ID'),
  name: z.string('Category Name is required').describe('Category Name'),
});

export class CategoryResponseDto extends createZodDto(categoryResponseSchema) {}

export class Category_MessageDto extends createZodDto(
  createMessageResponse(categoryResponseSchema),
  { codec: true },
) {}

export class CategoriesList_MessageDto extends createZodDto(
  createMessageResponse(z.array(categoryResponseSchema)),
  { codec: true },
) {}
