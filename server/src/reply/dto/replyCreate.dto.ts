import { IsOptional, IsInt, IsString } from 'class-validator';

export class ReplyCreateDto {
  @IsOptional()
  @IsString()
  body: string;

  @IsInt()
  commentId: number;

  // provided by controller to service
  userId: number;
  edited: boolean;
}

export class ReplyUpdateDto extends ReplyCreateDto {
  id: number;
}
