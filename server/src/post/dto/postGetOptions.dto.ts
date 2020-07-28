import { IsBoolean, IsOptional, IsInt, IsString } from 'class-validator';
import { GetOptionsDto } from '../../common/dto/getOptions.dto';
import { Transform } from 'class-transformer';

export class PostGetOptionsDto extends GetOptionsDto {
  @IsOptional()
  @IsBoolean()
  @Transform(val => val === 'true' || val === true)
  verified?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(val => val === 'true' || val === true)
  published?: boolean;

  @IsOptional()
  @IsInt()
  @Transform(val => parseInt(val))
  userId?: number;

  @IsOptional()
  @IsInt()
  @Transform(val => parseInt(val))
  categoryId?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
