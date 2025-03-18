import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { ConfigModule } from '@nestjs/config';
import { AuthSubscriber } from './auth.subscriber/auth.subscriber';
import { FileSubscriber } from './file.subscriber/file.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EmailModule,
  ],
  providers: [AuthSubscriber, FileSubscriber],
})
export class SubscribersModule {}