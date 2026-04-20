import { defineEntity, p, OptionalProps } from '@mikro-orm/core';


export const UserSchema = defineEntity({
  name: 'User',
  properties: {
    id: p.integer().primary(),
    email: () => p.string().unique(),
    nickname: () => p.string(),
    password: () => p.string(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class User extends UserSchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
}
