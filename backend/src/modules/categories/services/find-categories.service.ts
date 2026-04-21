import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { Category } from '../entities/category.entity';

@Injectable()
export class FindCategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}