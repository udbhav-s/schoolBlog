import { Controller, UseGuards, UseInterceptors, Get, ParseIntPipe, Post, Param, Body, ValidationPipe, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags, ApiBasicAuth, ApiOperation } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';
import { CategoryModel } from 'src/database/models/category.model';
import { CategoryCreateDto } from './dto/categoryCreate.dto';
import { Levels } from 'src/common/util/level.enum';
import { Level } from 'src/common/decorators/level.decorator';
import { LevelGuard } from 'src/common/guards/level.guard';

@ApiTags('category')
@ApiBasicAuth()
@UseGuards(AuthenticatedGuard)
@UseInterceptors(FormatResponseInterceptor)
@Controller('api/category')
export class CategoryController {
  constructor(
    private categoryService: CategoryService
  ) {}

  @ApiOperation({ summary: 'Get all categories' })
  @Get('/all')
  async getAll(): Promise<CategoryModel[]> {
    return await this.categoryService.getAll();
  }

  @ApiOperation({ summary: 'Get category by id' })
  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<CategoryModel> {
    return await this.categoryService.getById(id);
  }

  @ApiOperation({ summary: 'Create a category' })
  @UseGuards(LevelGuard)
  @Level(Levels.Moderator)
  @Post('/create')
  async create(
    @Body(ValidationPipe) body: CategoryCreateDto
  ): Promise<CategoryModel> {
    return await this.categoryService.create(body);
  }

  @ApiOperation({ summary: 'Update a category' })
  @UseGuards(LevelGuard)
  @Level(Levels.Moderator)
  @Post('/update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) body: CategoryCreateDto
  ): Promise<CategoryModel> {
    return await this.categoryService.update(id, body);
  }

  @ApiOperation({ summary: 'Delete a category' })
  @UseGuards(LevelGuard)
  @Level(Levels.Moderator)
  @Delete('/:id')
  async del(
    @Param('id', ParseIntPipe) id: number
  ): Promise<CategoryModel> {
    return await this.categoryService.del(id);
  }
}
