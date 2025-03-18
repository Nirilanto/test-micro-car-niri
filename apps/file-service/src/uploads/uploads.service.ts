import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { File } from './entities/file.entity';
import { S3Service } from '../s3/s3.service';
import { UploadFileDto, FileResponseDto } from '@app/common';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private s3Service: S3Service,
    @Inject('EMAIL_SERVICE') private emailClient: ClientProxy,
  ) {}

  async uploadFile(file: Express.Multer.File, uploadFileDto: UploadFileDto): Promise<FileResponseDto> {
    // Vérifier le type de fichier
    if (!['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
      throw new BadRequestException('Format de fichier non supporté. Seuls les formats PDF et JPEG sont acceptés.');
    }
    
    // Taille maximale de fichier (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('La taille du fichier dépasse la limite autorisée de 5MB.');
    }
    
    // Téléverser le fichier sur S3
    const { key, url } = await this.s3Service.uploadFile(file, uploadFileDto.userId);
    
    // Sauvegarder les métadonnées dans la base de données
    const newFile = this.filesRepository.create({
      userId: uploadFileDto.userId,
      originalName: file.originalname,
      filename: key.split('/').pop(),
      mimeType: file.mimetype,
      size: file.size,
      s3Key: key,
      s3Url: url,
    });
    
    await this.filesRepository.save(newFile);
    
    // Émettre un événement pour notification par email
    this.emailClient.emit('document_uploaded', {
      userId: uploadFileDto.userId,
      fileId: newFile.id,
      filename: newFile.originalName,
    });
    
    // Retourner les informations du fichier
    return {
      id: newFile.id,
      originalName: newFile.originalName,
      mimeType: newFile.mimeType,
      size: newFile.size,
      url: newFile.s3Url,
      uploadedAt: newFile.uploadedAt,
    };
  }
  
  async getFilesByUserId(userId: string): Promise<FileResponseDto[]> {
    const files = await this.filesRepository.find({
      where: { userId },
      order: { uploadedAt: 'DESC' },
    });
    
    return files.map(file => ({
      id: file.id,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      url: file.s3Url,
      uploadedAt: file.uploadedAt,
    }));
  }
  
  async deleteFile(fileId: string, userId: string): Promise<void> {
    const file = await this.filesRepository.findOneBy({ id: fileId, userId });
    
    if (!file) {
      throw new BadRequestException('Fichier non trouvé ou non autorisé');
    }
    
    // Supprimer de S3
    await this.s3Service.deleteFile(file.s3Key);
    
    // Supprimer de la base de données
    await this.filesRepository.remove(file);
  }
}