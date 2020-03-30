import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetOptionsDto {
  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt'])
  orderBy?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: string;

  @IsOptional()
  @IsInt()
  @Transform(val => parseInt(val))
  limit?: number;

  @IsOptional()
  @IsInt()
  @Transform(val => parseInt(val))
  offset?: number;
}
