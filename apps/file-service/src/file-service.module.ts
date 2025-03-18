import { Module } from '@nestjs/common';
import { FileServiceController } from './file-service.controller';
import { FileServiceService } from './file-service.service';
import { UploadsModule } from './uploads/uploads.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [UploadsModule, S3Module],
  controllers: [FileServiceController],
  providers: [FileServiceService],
})
export class FileServiceModule {}
