import { IsString, IsOptional, IsInt } from 'class-validator';

export class PostCreateDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  // provided by controller to service
  userId: number;
}
