// api-gateway/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration des pipes de validation
  app.useGlobalPipes(new ValidationPipe());
  
  // Activation de CORS
  app.enableCors();
  
  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('Car Rental API')
    .setDescription('API pour la gestion des locations de voiture avec authentification et téléversement de documents')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints d\'authentification')
    .addTag('files', 'Endpoints de gestion des fichiers')
    .addTag('profile', 'Endpoints de gestion du profil utilisateur')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3000);
  console.log('API Gateway is running on: http://localhost:3000');
  console.log('Swagger documentation available at: http://localhost:3000/api/docs');
}
bootstrap();