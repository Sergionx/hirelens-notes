import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Category } from '@/modules/categories/entities/category.entity';

export class CategorySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const categories = [
      { name: 'Work' },
      { name: 'Personal' },
      { name: 'Ideas' },
      { name: 'Urgent' },
      { name: 'Travel' },
    ];

    for (const cat of categories) {
      const exists = await em.findOne(Category, { name: cat.name });
      if (!exists) {
        em.create(Category, cat);
      }
    }
  }
}
