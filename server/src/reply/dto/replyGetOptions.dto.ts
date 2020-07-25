import { IsInt } from 'class-validator';
import { GetOptionsDto } from '../../common/dto/getOptions.dto';

export class ReplyGetOptionsDto extends GetOptionsDto {
  @IsInt()
  commentId?: number;
}
