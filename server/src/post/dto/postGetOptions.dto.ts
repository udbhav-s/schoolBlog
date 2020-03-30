import { IsBoolean, IsOptional } from 'class-validator';
import { GetOptionsDto } from '../../common/dto/getOptions.dto';

export class PostGetOptionsDto extends GetOptionsDto {
  @IsOptional()
  @IsBoolean()
  verifiedOrCurrentUser?: boolean;

  @IsOptional()
  // provided by controller to service
  userId?: number;
}
