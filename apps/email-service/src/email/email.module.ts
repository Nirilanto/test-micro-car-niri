// email-service/src/email/email.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule, // Importation du ConfigModule
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}