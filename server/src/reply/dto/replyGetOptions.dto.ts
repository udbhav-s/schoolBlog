import { IsInt, IsOptional } from 'class-validator';
import { GetOptionsDto } from '../../common/dto/getOptions.dto';
import { Transform } from 'class-transformer';

export class ReplyGetOptionsDto extends GetOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(id => parseInt(id))
  commentId?: number;
}
