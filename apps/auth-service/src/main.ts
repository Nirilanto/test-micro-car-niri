import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  const configService = app.get(ConfigService);
  
  app.useGlobalPipes(new ValidationPipe());
  
  // Configuration RabbitMQ pour la réception des messages
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASSWORD')}@${configService.get('RABBITMQ_HOST', 'rabbitmq')}:${configService.get('RABBITMQ_PORT', '5672')}`],
      queue: 'auth_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  
  await app.startAllMicroservices();
  await app.listen(3001);
  console.log('Auth Service is running on: http://localhost:3001');
  console.log('Auth Microservice is listening');
}
bootstrap();