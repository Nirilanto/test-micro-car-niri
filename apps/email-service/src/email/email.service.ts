import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_PORT') === 465,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  private async compileTemplate(templateName: string, context: any): Promise<string> {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.hbs`);
    const source = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(source);
    return template(context);
  }

  async sendUserRegistration(email: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${verificationToken}`;
    
    const html = await this.compileTemplate('registration', {
      verificationUrl,
    });
    
    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Bienvenue chez Car Rental - Vérifiez votre email',
      html,
    });
  }

  async sendDocumentUploaded(email: string, filename: string): Promise<void> {
    const html = await this.compileTemplate('document-upload', {
      filename,
      dashboardUrl: `${this.configService.get('FRONTEND_URL')}/dashboard`,
    });
    
    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Document téléversé avec succès',
      html,
    });
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    
    const html = await this.compileTemplate('password-reset', {
      resetUrl,
    });
    
    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Réinitialisation de mot de passe',
      html,
    });
  }
}