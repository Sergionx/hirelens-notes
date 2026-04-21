import { createZodDto } from 'nestjs-zod';
import { categoryResponseSchema } from './category-response.dto';

const createCategorySchema = categoryResponseSchema.pick({
  name: true,
});

export class CreateCategoryDto extends createZodDto(createCategorySchema) {}