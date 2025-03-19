import { Injectable, UnauthorizedException, Inject, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, UserResponseDto } from '@app/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('EMAIL_SERVICE') private emailClient: ClientProxy,
  ) { }

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    // Créer l'utilisateur
    const user = await this.usersService.create(registerDto);

    // Générer un token pour la vérification d'email
    const verificationToken = this.jwtService.sign(
      { sub: user.id, email: user.email, purpose: 'email_verification' },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '24h'
      }
    );

    // Émettre un événement pour envoyer un email de confirmation
    this.emailClient.emit('user_registered', {
      userId: user.id,
      email: user.email,
      token: verificationToken
    });

    return user;
  }

  async login(loginDto: LoginDto) {
    console.log("Début de la procédure de login", loginDto);

    try {
      const user = await this.usersService.validateUser(
        loginDto.email,
        loginDto.password,
      );

      if (!user) {
        throw new UnauthorizedException('Email ou mot de passe invalide');
      }

      const payload = { email: user.email, sub: user.id };

      return {
        user,
        access_token: this.jwtService.sign(payload, {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_EXPIRATION', '1h'),
        }),
      };
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (payload.purpose !== 'email_verification') {
        throw new UnauthorizedException('Token invalide');
      }

      await this.usersService.markEmailAsVerified(payload.sub);
    } catch (error) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      const resetToken = this.jwtService.sign(
        { sub: user.id, email: user.email, purpose: 'password_reset' },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '1h'
        }
      );

      this.emailClient.emit('password_reset_requested', {
        userId: user.id,
        email: user.email,
        token: resetToken
      });
    }
    // Nous ne renvoyons pas d'erreur si l'utilisateur n'existe pas pour des raisons de sécurité
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (payload.purpose !== 'password_reset') {
        throw new UnauthorizedException('Token invalide');
      }

      // Implémentez la logique de réinitialisation du mot de passe
      // await this.usersService.updatePassword(payload.sub, newPassword);
    } catch (error) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  async getUserProfile(userId: string): Promise<UserResponseDto> {
    console.log(`Récupération du profil pour l'utilisateur ID: ${userId}`);
    const user = await this.usersService.findOneById(userId);

    if (!user) {
      throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
    }

    // Retirer explicitement le mot de passe de la réponse
    const { password, ...userResponse } = user;
    return userResponse as UserResponseDto;
  }
}