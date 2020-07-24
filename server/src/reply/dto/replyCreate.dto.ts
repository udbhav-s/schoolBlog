import { IsInt, IsString } from 'class-validator';

export class ReplyCreateDto {
  @IsString()
  body: string;

  @IsInt()
  commentId: number;

  // provided by controller to service
  userId: number;
  edited: boolean;
}
