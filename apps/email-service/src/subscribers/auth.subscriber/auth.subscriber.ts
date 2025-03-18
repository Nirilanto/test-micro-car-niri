import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from '../../email/email.service';

@Controller()
export class AuthSubscriber {
  constructor(private emailService: EmailService) {}

  @EventPattern('user_registered')
  async handleUserRegistered(@Payload() data: { userId: string; email: string; token: string }) {
    console.log('Received user_registered event:', data);
    try {
      await this.emailService.sendUserRegistration(data.email, data.token);
      console.log(`Email de confirmation envoyé à ${data.email}`);
    } catch (error) {
      console.error(`Erreur lors de l'envoi de l'email à ${data.email}:`, error);
    }
  }

  @EventPattern('password_reset_requested')
  async handlePasswordResetRequested(@Payload() data: { userId: string; email: string; token: string }) {
    console.log('Received password_reset_requested event:', data);
    try {
      await this.emailService.sendPasswordReset(data.email, data.token);
      console.log(`Email de réinitialisation de mot de passe envoyé à ${data.email}`);
    } catch (error) {
      console.error(`Erreur lors de l'envoi de l'email à ${data.email}:`, error);
    }
  }
}