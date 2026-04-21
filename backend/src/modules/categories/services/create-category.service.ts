import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UniqueConstraintViolationException } from '@mikro-orm/core';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryFindMessages } from '../categories.constants';

@Injectable()
export class CreateCategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    
    try {
      await this.categoryRepository.getEntityManager().flush();
      return category;
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new ConflictException(CategoryFindMessages.Errors.AlreadyExists);
      }
      throw error;
    }
  }
}