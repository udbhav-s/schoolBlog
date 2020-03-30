import { IsEnum, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class PostGetOptionsDto {
  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt'])
  orderBy?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: string;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsInt()
  offset?: number;

  @IsOptional()
  @IsBoolean()
  verifiedOrCurrentUser?: boolean;

  @IsOptional()
  // provided by controller to service
  userId?: number;
}
