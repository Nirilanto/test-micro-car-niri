import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailServiceController } from './email-service.controller';
import { EmailService } from './email-service.service';
import { EmailModule } from './email/email.module';
import { SubscribersModule } from './subscribers/subscribers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EmailModule,
    SubscribersModule,
  ],
  controllers: [EmailServiceController],
  providers: [EmailService],
})
export class EmailServiceModule {}