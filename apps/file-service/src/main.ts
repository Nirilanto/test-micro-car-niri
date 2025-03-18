import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { FileServiceModule } from './file-service.module';

async function bootstrap() {
  const app = await NestFactory.create(FileServiceModule);
  const configService = app.get(ConfigService);
  
  app.useGlobalPipes(new ValidationPipe());
  
  // Configuration RabbitMQ pour la réception des messages
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASSWORD')}@${configService.get('RABBITMQ_HOST', 'rabbitmq')}:${configService.get('RABBITMQ_PORT', '5672')}`],
      queue: 'file_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  
  await app.startAllMicroservices();
  await app.listen(3002);
  console.log('File Service is running on: http://localhost:3002');
  console.log('File Microservice is listening');
}
bootstrap();