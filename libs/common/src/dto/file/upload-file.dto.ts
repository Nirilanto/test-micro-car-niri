// libs/common/src/dto/file/upload-file.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}