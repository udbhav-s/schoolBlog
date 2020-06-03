import { IsString, IsEnum, IsInt } from "class-validator";
import { Transform } from "class-transformer";

export class FileUploadDto {
  @IsString()
  @IsEnum(["image", "attachment", "thumbnail"])
  type: string;

  @IsInt()
  @Transform(id => parseInt(id))
  postId: number;
}