import { IsBoolean, IsOptional, IsInt } from 'class-validator';
import { GetOptionsDto } from '../../common/dto/getOptions.dto';
import { Transform } from 'class-transformer';

export class PostGetOptionsDto extends GetOptionsDto {
  @IsOptional()
  @IsBoolean()
  @Transform(val => (val === 'true'))
  verified?: boolean;

  @IsOptional()
  @IsInt()
  @Transform(val => parseInt(val))
  userId?: number;

  // provided by controller to service
  verifiedOrUser?: boolean;
}
