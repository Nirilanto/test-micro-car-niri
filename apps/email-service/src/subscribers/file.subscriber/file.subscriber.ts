import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from '../../email/email.service';

@Controller()
export class FileSubscriber {
  constructor(private emailService: EmailService) {}

  @EventPattern('document_uploaded')
  async handleDocumentUploaded(@Payload() data: { userId: string; fileId: string; filename: string; email: string }) {
    console.log('Received document_uploaded event:', data);
    try {
      await this.emailService.sendDocumentUploaded(data.email, data.filename);
      console.log(`Email de confirmation de téléversement envoyé à ${data.email}`);
    } catch (error) {
      console.error(`Erreur lors de l'envoi de l'email à ${data.email}:`, error);
    }
  }
}