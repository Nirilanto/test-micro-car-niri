import { Module } from '@nestjs/common';
import { EmailServiceController } from './email-service.controller';
import { EmailServiceService } from './email-service.service';
import { EmailModule } from './email/email.module';
import { SubscribersModule } from './subscribers/subscribers.module';

@Module({
  imports: [EmailModule, SubscribersModule],
  controllers: [EmailServiceController],
  providers: [EmailServiceService],
})
export class EmailServiceModule {}
