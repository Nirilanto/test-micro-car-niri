import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EmailServiceModule } from './email-service.module';

async function bootstrap() {
  const app = await NestFactory.create(EmailServiceModule);
  const configService = app.get(ConfigService);
  
  // Configuration RabbitMQ pour la réception des messages
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASSWORD')}@${configService.get('RABBITMQ_HOST', 'rabbitmq')}:${configService.get('RABBITMQ_PORT', '5672')}`],
      queue: 'email_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  
  await app.startAllMicroservices();
  console.log('Email Microservice is listening');
}
bootstrap();