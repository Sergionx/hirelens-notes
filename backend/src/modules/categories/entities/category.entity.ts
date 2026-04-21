import { defineEntity, p } from '@mikro-orm/core';

export const CategorySchema = defineEntity({
  name: 'Category',
  properties: {
    id: p.integer().primary(),
    name: () => p.string().unique(),
  },
});

export class Category extends CategorySchema.class {}
