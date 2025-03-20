import { Injectable, BadRequestException, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { File } from './entities/file.entity';
import { S3Service } from '../s3/s3.service';
import { FileResponseDto } from '@app/common';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private s3Service: S3Service,
    @Inject('EMAIL_SERVICE') private emailClient: ClientProxy
  ) {}

  async uploadFile(file: any, userId: string): Promise<FileResponseDto> {
    console.log('UploadsService: début upload pour utilisateur:', userId);
    
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }
    
    if (!userId) {
      throw new BadRequestException('ID utilisateur manquant');
    }
    
    // Vérifier le type de fichier
    if (!['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
      throw new BadRequestException('Format de fichier non supporté. Seuls les formats PDF et JPEG sont acceptés.');
    }
    
    // Taille maximale de fichier (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('La taille du fichier dépasse la limite autorisée de 5MB.');
    }
    
    try {
      // Vérifier si nous avons un buffer base64 et le convertir en Buffer
      if (!file.buffer && file.bufferBase64) {
        console.log('Conversion du buffer base64 en Buffer');
        // Convertir la chaîne Base64 en Buffer standard
        const fileBuffer = Buffer.from(file.bufferBase64, 'base64');
        
        // Reconstituer l'objet file avec le buffer correct
        file = {
          ...file,
          buffer: fileBuffer
        };
      } else if (!file.buffer) {
        throw new BadRequestException('Le fichier ne contient pas de données (buffer manquant)');
      }
      
      console.log(`Buffer prêt pour upload: ${typeof file.buffer}, isBuffer: ${Buffer.isBuffer(file.buffer)}, taille: ${file.buffer.length} bytes`);
      
      // Téléverser le fichier sur S3
      const { key, url } = await this.s3Service.uploadFile(file, userId);
      
      // Sauvegarder les métadonnées dans la base de données
      const newFile = this.filesRepository.create({
        userId,
        originalName: file.originalname,
        filename: key.split('/').pop(),
        mimeType: file.mimetype,
        size: file.size,
        s3Key: key,
        s3Url: url,
      });
      
      await this.filesRepository.save(newFile);
      
      // Émettre un événement pour notification par email
      try {
        this.emailClient.emit('document_uploaded', {
          userId,
          fileId: newFile.id,
          filename: newFile.originalName,
        });
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de la notification par email:', emailError);
        // Ne pas bloquer le processus si l'email échoue
      }
      
      console.log('UploadsService: fichier téléversé avec succès:', newFile.id);
      
      // Retourner les informations du fichier
      return {
        id: newFile.id,
        originalName: newFile.originalName,
        mimeType: newFile.mimeType,
        size: newFile.size,
        url: await this.s3Service.getSignedUrl(newFile.s3Key),
        uploadedAt: newFile.uploadedAt,
      };
    } catch (error) {
      console.error('Erreur lors du téléversement du fichier:', error);
      throw new InternalServerErrorException('Erreur lors du téléversement du fichier: ' + error.message);
    }
  }
  
  async getFilesByUserId(userId: string): Promise<FileResponseDto[]> {
    const files = await this.filesRepository.find({
      where: { userId },
      order: { uploadedAt: 'DESC' },
    });
    
    // Générer des URLs signées pour chaque fichier
    const filesWithUrls = await Promise.all(
      files.map(async (file) => ({
        id: file.id,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        url: await this.s3Service.getSignedUrl(file.s3Key),
        uploadedAt: file.uploadedAt,
      }))
    );
    
    return filesWithUrls;
  }
  
  async getFileById(fileId: string, userId: string): Promise<FileResponseDto> {
    const file = await this.filesRepository.findOne({ 
      where: { id: fileId, userId } 
    });
    
    if (!file) {
      throw new NotFoundException('Fichier non trouvé ou non autorisé');
    }
    
    return {
      id: file.id,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      url: await this.s3Service.getSignedUrl(file.s3Key),
      uploadedAt: file.uploadedAt,
    };
  }
  
  async deleteFile(fileId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const file = await this.filesRepository.findOne({ 
      where: { id: fileId, userId } 
    });
    
    if (!file) {
      throw new NotFoundException('Fichier non trouvé ou non autorisé');
    }
    
    try {
      // Supprimer de S3
      await this.s3Service.deleteFile(file.s3Key);
      
      // Supprimer de la base de données
      await this.filesRepository.remove(file);
      
      // Renvoyer une réponse explicite
      return {
        success: true,
        message: `Fichier ${fileId} supprimé avec succès`
      };
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
      throw new InternalServerErrorException(`Erreur lors de la suppression du fichier: ${error.message}`);
    }
  }
}