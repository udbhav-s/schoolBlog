import { IsString, IsOptional, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class PostCreateDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  @Transform(body => body ? body : "")
  body?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  // provided by controller to service
  userId: number;
}
