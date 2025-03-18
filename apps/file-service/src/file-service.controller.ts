import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UploadsService } from './uploads/uploads.service';
import { UploadFileDto } from '@app/common';

@Controller()
export class FileServiceController {
  constructor(private readonly uploadsService: UploadsService) {}

  @MessagePattern('upload_file')
  async uploadFile(@Payload() data: { file: Express.Multer.File, uploadFileDto: UploadFileDto }) {
    return this.uploadsService.uploadFile(data.file, data.uploadFileDto.userId);
  }

  @MessagePattern('get_files_by_user')
  async getFilesByUser(@Payload() userId: string) {
    return this.uploadsService.getFilesByUserId(userId);
  }

  @MessagePattern('delete_file')
  async deleteFile(@Payload() data: { fileId: string, userId: string }) {
    return this.uploadsService.deleteFile(data.fileId, data.userId);
  }
}