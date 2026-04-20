import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '@/modules/auth/entities/user/user.entity';

export class UserSeeder extends Seeder {
  private readonly logger = new Logger(UserSeeder.name);

  async run(em: EntityManager): Promise<void> {
    const adminExists = await em.findOne(User, {
      email: 'admin@hirelens.com',
    });

    if (!adminExists) {
      this.logger.log('Seeding admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = em.create(User, {
        email: 'admin@hirelens.com',
        nickname: 'admin',
        password: hashedPassword,
      });
      await em.persist(admin).flush();
      this.logger.log('Admin user seeded successfully.');
    }
  }
}

