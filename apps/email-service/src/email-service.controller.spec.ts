import { Test, TestingModule } from '@nestjs/testing';
import { EmailServiceController } from './email-service.controller';
import { EmailService } from './email-service.service';

describe('EmailServiceController', () => {
  let emailServiceController: EmailServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmailServiceController],
      providers: [EmailService],
    }).compile();

    emailServiceController = app.get<EmailServiceController>(EmailServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(emailServiceController.getHello()).toBe('Hello World!');
    });
  });
});
