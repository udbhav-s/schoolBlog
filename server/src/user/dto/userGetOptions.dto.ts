import { IsOptional, IsInt } from 'class-validator';
import { GetOptionsDto } from '../../common/dto/getOptions.dto';
import { Transform } from 'class-transformer';

export class UserGetOptionsDto extends GetOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(val => parseInt(val))
  minLevel?: number;
}
