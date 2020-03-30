import { IsString, IsOptional, IsInt } from 'class-validator';

export class PostCreateDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsOptional()
  @IsString()
  category: string;

  // provided by controller to service
  @IsOptional()
  userId: number;

  @IsOptional()
  files: object[];
}

export class PostUpdateDto extends PostCreateDto {
  @IsOptional()
  @IsInt()
  id: number;
}
