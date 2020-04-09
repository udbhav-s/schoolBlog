import { Injectable, Inject } from '@nestjs/common';
import { CategoryModel } from '../database/models/category.model';
import { ModelClass } from 'objection';
import { CategoryCreateDto } from './dto/categoryCreate.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CategoryModel') private categoryModel: ModelClass<CategoryModel>
  ) {}

  async getAll(): Promise<CategoryModel[]> {
    return await this.categoryModel.query();
  }

  async getById(id: number): Promise<CategoryModel> {
    return await this.categoryModel.query().findById(id);
  }

  async create(body: CategoryCreateDto): Promise<CategoryModel> {
    return await this.categoryModel.query().insert(body).returning('*');
  }

  async update(id: number, body: CategoryCreateDto): Promise<CategoryModel> {
    return await this.categoryModel
      .query()
      .where({ id })
      .patch(body)
      .returning('*')
      .first();
  }

  async del(id: number): Promise<CategoryModel> {
    return await this.categoryModel
      .query()
      .where({ id })
      .del()
      .returning('*')
      .first();
  }
}
