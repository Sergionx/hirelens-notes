import {
  Entity,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

@Entity()
export class User {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id: number;

  @Property()
  @Unique()
  username: string;

  @Property()
  password: string; // Hashed

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
