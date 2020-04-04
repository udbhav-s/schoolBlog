import { IsString, IsOptional } from 'class-validator';

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
  userId: number;
  files: object[];
}

export class PostUpdateDto extends PostCreateDto {
  id: number;
}
