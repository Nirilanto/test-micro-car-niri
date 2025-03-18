import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FileServiceController } from './file-service.controller';
import { FileServiceService } from './file-service.service';
import { S3Module } from './s3/s3.module';
import { UploadsModule } from './uploads/uploads.module';
import { File } from './uploads/entities/file.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST', 'postgres'),
        port: configService.get('POSTGRES_PORT', 5432),
        username: configService.get('POSTGRES_USER', 'postgres'),
        password: configService.get('POSTGRES_PASSWORD', 'yourpassword'),
        database: configService.get('POSTGRES_DB', 'car_rental'),
        entities: [File],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'EMAIL_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASSWORD')}@${configService.get('RABBITMQ_HOST', 'rabbitmq')}:${configService.get('RABBITMQ_PORT', '5672')}`],
            queue: 'email_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
    S3Module,
    UploadsModule,
  ],
  controllers: [FileServiceController],
  providers: [FileServiceService],
})
export class FileServiceModule {}