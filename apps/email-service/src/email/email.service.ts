// email-service/src/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);
  private readonly isDev: boolean;

  constructor(private configService: ConfigService) {
    this.isDev = this.configService.get('NODE_ENV') !== 'production';
    
    if (this.isDev) {
      // Configuration pour MailHog en développement
      this.logger.log('Initialisation du service d\'email avec MailHog');
      this.transporter = nodemailer.createTransport({
        host: this.configService.get('MAILHOG_HOST', 'mailhog'),
        port: parseInt(this.configService.get('MAILHOG_PORT', '1025')),
        ignoreTLS: true
      });
    } else {
      // Configuration pour un vrai service SMTP en production
      this.logger.log('Initialisation du service d\'email avec SMTP');
      this.transporter = nodemailer.createTransport({
        host: this.configService.get('SMTP_HOST'),
        port: parseInt(this.configService.get('SMTP_PORT', '587')),
        secure: parseInt(this.configService.get('SMTP_PORT', '587')) === 465,
        auth: {
          user: this.configService.get('SMTP_USER'),
          pass: this.configService.get('SMTP_PASSWORD'),
        },
      });
    }

    // Vérifier la connexion au démarrage
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('Connexion au serveur email réussie');
    } catch (error) {
      this.logger.error(`Erreur de connexion au serveur email: ${error.message}`);
    }
  }

  private async compileTemplate(templateName: string, context: any): Promise<string> {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.hbs`);
    try {
      const source = fs.readFileSync(templatePath, 'utf-8');
      const template = handlebars.compile(source);
      return template(context);
    } catch (error) {
      this.logger.error(`Erreur lors de la compilation du template ${templateName}: ${error.message}`);
      throw error;
    }
  }

  async sendUserRegistration(email: string, verificationToken: string): Promise<void> {
    this.logger.log(`Envoi d'email de vérification à ${email}`);
    
    const verificationUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/verify-email?token=${verificationToken}`;
    
    const html = await this.compileTemplate('registration', {
      verificationUrl,
    });
    
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM', 'noreply@car-rental.com'),
        to: email || 'example.mail.com',
        subject: 'Bienvenue chez Car Rental - Vérifiez votre email',
        html,
      });
      
      if (this.isDev) {
        // En développement, afficher l'URL pour voir l'email dans MailHog
        this.logger.log(`Email envoyé avec succès à ${email}. ID du message: ${info.messageId}`);
        this.logger.log(`Voir l'email dans MailHog: http://localhost:8025`);
      } else {
        this.logger.log(`Email envoyé avec succès à ${email}. ID du message: ${info.messageId}`);
      }
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi d'email à ${email}: ${error.message}`);
      throw error;
    }
  }

  async sendDocumentUploaded(email: string, filename: string): Promise<void> {
    this.logger.log(`Envoi d'email de confirmation de téléversement à ${email}`);
    
    const html = await this.compileTemplate('document-upload', {
      filename,
      dashboardUrl: `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/dashboard`,
    });
    
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM', 'noreply@car-rental.com'),
        to: email || 'example.mail.com',
        subject: 'Document téléversé avec succès',
        html,
      });
      
      if (this.isDev) {
        this.logger.log(`Email envoyé avec succès à ${email}. ID du message: ${info.messageId}`);
        this.logger.log(`Voir l'email dans MailHog: http://localhost:8025`);
      } else {
        this.logger.log(`Email envoyé avec succès à ${email}. ID du message: ${info.messageId}`);
      }
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi d'email à ${email}: ${error.message}`);
      throw error;
    }
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<void> {
    this.logger.log(`Envoi d'email de réinitialisation de mot de passe à ${email}`);
    
    const resetUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/reset-password?token=${resetToken}`;
    
    const html = await this.compileTemplate('password-reset', {
      resetUrl,
    });
    
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM', 'noreply@car-rental.com'),
        to: email || 'example.mail.com',
        subject: 'Réinitialisation de mot de passe',
        html,
      });
      
      if (this.isDev) {
        this.logger.log(`Email envoyé avec succès à ${email}. ID du message: ${info.messageId}`);
        this.logger.log(`Voir l'email dans MailHog: http://localhost:8025`);
      } else {
        this.logger.log(`Email envoyé avec succès à ${email}. ID du message: ${info.messageId}`);
      }
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi d'email à ${email}: ${error.message}`);
      throw error;
    }
  }
}