import { User } from '@/modules/auth/entities/user/user.entity';
import { Category } from '@/modules/categories/entities/category.entity';
import { defineEntity, p, OptionalProps, Collection } from '@mikro-orm/core';

export const NoteSchema = defineEntity({
  name: 'Note',
  properties: {
    id: p.integer().primary(),
    title: () => p.string(),
    content: () => p.text(),
    isArchived: () => p.boolean().default(false),
    author: () => p.manyToOne(User),
    categories: () => p.manyToMany(Category),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class Note extends NoteSchema.class {
  [OptionalProps]?: 'isArchived' | 'createdAt' | 'updatedAt';
  // categories = new Collection<Category>(this);
}
