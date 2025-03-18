import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(file: Express.Multer.File, userId: string): Promise<{ key: string; url: string }> {
    const bucketName = this.configService.get('AWS_BUCKET_NAME');
    const fileExt = file.originalname.split('.').pop();
    const key = `users/${userId}/${uuid()}.${fileExt}`;
    
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private',
    };
    
    const uploadResult = await this.s3.upload(params).promise();
    
    return {
      key,
      url: uploadResult.Location,
    };
  }

  async deleteFile(key: string): Promise<void> {
    const bucketName = this.configService.get('AWS_BUCKET_NAME');
    
    const params = {
      Bucket: bucketName,
      Key: key,
    };
    
    await this.s3.deleteObject(params).promise();
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const bucketName = this.configService.get('AWS_BUCKET_NAME');
    
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expiresIn,
    };
    
    return this.s3.getSignedUrlPromise('getObject', params);
  }
}