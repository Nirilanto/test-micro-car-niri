// file-service/src/uploads/uploads.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { File } from './entities/file.entity';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    S3Module,
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}