import { IsInt } from 'class-validator';
import { GetOptionsDto } from '../../common/dto/getOptions.dto';

export class CommentGetOptionsDto extends GetOptionsDto {
  @IsInt()
  postId?: number;
}
