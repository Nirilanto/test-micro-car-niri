// file-service/src/s3/s3.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3;
  private readonly logger = new Logger(S3Service.name);
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    // Utiliser des valeurs par défaut pour éviter les undefined
    const endpoint = this.configService.get<string>('AWS_ENDPOINT') || 'http://85.239.244.252/8:9000';
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID') || 'minio';
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || 'minio123';
    const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';

    // Stocker le nom du bucket comme propriété de classe
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME') || 'car-rental-documents';

    this.logger.log(`Initializing S3 client with endpoint: ${endpoint}`);

    this.s3 = new S3({
      endpoint,
      accessKeyId,
      secretAccessKey,
      region,
      s3ForcePathStyle: true,
      signatureVersion: 'v4'
    });

    // Vérifier que le bucket existe
    this.checkBucket().catch(err => this.logger.error('Failed to check bucket', err));
  }

  private async checkBucket(): Promise<void> {
    try {
      await this.s3.headBucket({ Bucket: this.bucketName }).promise();
      this.logger.log(`Bucket "${this.bucketName}" is accessible`);
    } catch (error) {
      this.logger.warn(`Bucket "${this.bucketName}" not found or not accessible. Attempting to create it...`);
      try {
        await this.s3.createBucket({ Bucket: this.bucketName }).promise();
        this.logger.log(`Bucket "${this.bucketName}" created successfully`);
      } catch (createError) {
        this.logger.error(`Failed to create bucket "${this.bucketName}"`, createError);
        throw createError;
      }
    }
  }

  async uploadFile(file: any, userId: string): Promise<{ key: string; url: string }> {
    if (!file || !file.buffer || !Buffer.isBuffer(file.buffer)) {
      this.logger.error(`Format de fichier invalide pour S3: ${JSON.stringify({
        hasFile: !!file,
        hasBuffer: file ? !!file.buffer : false,
        bufferType: file && file.buffer ? typeof file.buffer : 'none',
        isBuffer: file && file.buffer ? Buffer.isBuffer(file.buffer) : false
      })}`);
      throw new Error('Format de fichier invalide pour l\'upload S3');
    }

    const fileExt = file.originalname.split('.').pop() || '';
    const key = `users/${userId}/${uuid()}.${fileExt}`;

    this.logger.log(`Tentative d'upload sur S3: ${key} (${file.mimetype}, ${file.size} bytes)`);

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const uploadResult = await this.s3.upload(params).promise();
      this.logger.log(`File uploaded successfully: ${key}, ETag: ${uploadResult.ETag}`);

      const signedUrl = await this.getSignedUrl(key);
      this.logger.log(`URL signée générée pour ${key}`);

      return {
        key,
        url: signedUrl,
      };
    } catch (error) {
      this.logger.error(`Failed to upload file: ${key}`, error);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<{ deleted: boolean }> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };
    
    try {
      await this.s3.deleteObject(params).promise();
      this.logger.log(`File deleted successfully: ${key}`);
      return { deleted: true };
    } catch (error) {
      this.logger.error(`Failed to delete file: ${key}`, error);
      throw error;
    }
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: expiresIn,
    };

    try {
      return await this.s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      this.logger.error(`Failed to generate signed URL for: ${key}`, error);
      throw error;
    }
  }
}