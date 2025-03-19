// email-service/src/email-service.controller.js
import { Controller } from '@nestjs/common';
import { EmailService } from './email-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class EmailServiceController {
  constructor(private readonly emailServiceService: EmailService) {}

  @MessagePattern('send_registration_email')
  async sendRegistrationEmail(@Payload() data: { email: string, token: string }) {
    try {
      await this.emailServiceService.sendUserRegistration(data.email, data.token);
      return { success: true, message: 'Email de bienvenue envoyé avec succès' };
    } catch (error) {
      return { 
        success: false, 
        message: 'Erreur lors de l\'envoi de l\'email de bienvenue', 
        error: error.message 
      };
    }
  }

  @MessagePattern('send_document_upload_notification')
  async sendDocumentUploadNotification(@Payload() data: { email: string, filename: string }) {
    try {
      await this.emailServiceService.sendDocumentUploaded(data.email, data.filename);
      return { success: true, message: 'Notification de téléversement envoyée avec succès' };
    } catch (error) {
      return { 
        success: false, 
        message: 'Erreur lors de l\'envoi de la notification de téléversement', 
        error: error.message 
      };
    }
  }

  @MessagePattern('send_password_reset_email')
  async sendPasswordResetEmail(@Payload() data: { email: string, token: string }) {
    try {
      await this.emailServiceService.sendPasswordReset(data.email, data.token);
      return { success: true, message: 'Email de réinitialisation de mot de passe envoyé avec succès' };
    } catch (error) {
      return { 
        success: false, 
        message: 'Erreur lors de l\'envoi de l\'email de réinitialisation', 
        error: error.message 
      };
    }
  }

  @MessagePattern('check_email_service_health')
  async checkHealth() {
    return { 
      status: 'ok', 
      service: 'email-service',
      timestamp: new Date().toISOString()
    };
  }
}