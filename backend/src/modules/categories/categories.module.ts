import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Category } from './entities/category.entity';
import { CategoriesController } from './categories.controller';
import { FindCategoriesService } from './services/find-categories.service';
import { CreateCategoryService } from './services/create-category.service';
import { RemoveCategoryService } from './services/remove-category.service';

@Module({
  imports: [MikroOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [FindCategoriesService, CreateCategoryService, RemoveCategoryService],
  exports: [MikroOrmModule.forFeature([Category]), FindCategoriesService],
})
export class CategoriesModule {}