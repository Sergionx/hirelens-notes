import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { Category } from '../entities/category.entity';
import { CategoryFindMessages } from '../categories.constants';

@Injectable()
export class RemoveCategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
  ) {}

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne(id);
    if (!category)
      throw new NotFoundException(CategoryFindMessages.Errors.NotFound);

    await this.categoryRepository.getEntityManager().remove(category).flush();
  }
}
