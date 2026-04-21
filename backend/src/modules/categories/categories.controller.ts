import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { NullResponseDto } from '@/schemas/common/messageResponse';

import {
  CategoryCreateMessages,
  CategoryDeleteMessages,
  CategoryFindMessages,
} from './categories.constants';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  CategoriesList_MessageDto,
  Category_MessageDto,
} from './dto/category-response.dto';

import { FindCategoriesService } from './services/find-categories.service';
import { CreateCategoryService } from './services/create-category.service';
import { RemoveCategoryService } from './services/remove-category.service';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(
    private readonly findCategoriesService: FindCategoriesService,
    private readonly createCategoryService: CreateCategoryService,
    private readonly removeCategoryService: RemoveCategoryService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'List all categories' })
  @ZodResponse({
    description: CategoryFindMessages.ListSuccess,
    type: CategoriesList_MessageDto,
  })
  async findAll() {
    const data = await this.findCategoriesService.findAll();
    return { data, message: CategoryFindMessages.ListSuccess };
  }

  @Post('/')
  @ApiOperation({ summary: 'Create a new category' })
  @ZodResponse({
    description: CategoryCreateMessages.Success,
    type: Category_MessageDto,
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.createCategoryService.create(createCategoryDto);
    return {
      message: CategoryCreateMessages.Success,
      data: category,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a category' })
  @ZodResponse({
    description: CategoryDeleteMessages.Success,
    type: NullResponseDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.removeCategoryService.remove(id);
    return {
      message: CategoryDeleteMessages.Success,
      data: null,
    };
  }
}
