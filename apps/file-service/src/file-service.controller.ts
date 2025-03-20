// file-service/src/file-service.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UploadsService } from './uploads/uploads.service';

@Controller()
export class FileServiceController {
  constructor(private readonly uploadsService: UploadsService) { }

  @MessagePattern('upload_file')
  async uploadFile(@Payload() data: any) {
    console.log('FileServiceController received upload request:', {
      dataKeys: Object.keys(data),
      hasFile: !!data.file,
      hasUserId: !!data.userId,
      fileBufferType: data.file ? (data.file.buffer ? 'buffer' : (data.file.bufferBase64 ? 'base64' : 'none')) : 'no-file'
    });

    if (data && data.file && data.userId) {
      return this.uploadsService.uploadFile(data.file, data.userId);
    } else {
      throw new Error('Données incomplètes: file ou userId manquant');
    }
  }

  @MessagePattern('get_files_by_user')
  async getFilesByUser(@Payload() userId: string) {
    console.log('Getting files for user:', userId);
    return this.uploadsService.getFilesByUserId(userId);
  }

  @MessagePattern('get_file_by_id')
  async getFileById(@Payload() data: { fileId: string, userId: string }) {
    return this.uploadsService.getFileById(data.fileId, data.userId);
  }

  @MessagePattern('delete_file')
  async deleteFile(@Payload() data: { fileId: string, userId: string }) {
    console.log(`FileServiceController: demande de suppression du fichier ${data.fileId} pour l'utilisateur ${data.userId}`);

    const result = await this.uploadsService.deleteFile(data.fileId, data.userId);

    console.log(`FileServiceController: résultat de la suppression:`, result);
    // S'assurer qu'une valeur est toujours renvoyée
    return result;
  }
}