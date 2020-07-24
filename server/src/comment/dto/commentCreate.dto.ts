import { IsInt, IsString } from 'class-validator';

export class CommentCreateDto {
  @IsString()
  body: string;

  @IsInt()
  postId: number;

  // provided by controller to service
  userId: number;
  edited: boolean;
}
