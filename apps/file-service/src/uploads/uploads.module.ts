// file-service/src/uploads/uploads.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { File } from './entities/file.entity';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    S3Module,
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'EMAIL_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASSWORD')}@${configService.get('RABBITMQ_HOST')}`],
            queue: 'email_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService], 
})
export class UploadsModule {}