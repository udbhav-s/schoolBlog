import { IsString, IsEnum } from "class-validator";

export class FileUploadDto {
  @IsString()
  @IsEnum(["image", "attachment", "thumbnail"])
  type: string;
}