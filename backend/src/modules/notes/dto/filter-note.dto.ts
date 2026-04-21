import z from 'zod';
import { createZodDto } from 'nestjs-zod';

export const filterNoteSchema = z.object({
  archived: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === 'string') return val === 'true';
      return val;
    }),
  categoryIds: z
    .union([z.string(), z.array(z.number()), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (typeof val === 'string') {
        return val.split(',').map((v) => parseInt(v.trim(), 10)).filter(n => !isNaN(n));
      }
      if (Array.isArray(val)) {
        return val.map((v) => parseInt(v as string, 10)).filter(n => !isNaN(n));
      }
      return val;
    }),
});

export class FilterNoteDto extends createZodDto(filterNoteSchema) {}