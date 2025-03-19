import { Injectable, UnauthorizedException, Inject, HttpException, HttpStatus } from '@nestjs/common';
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
      { expiresIn: '24h' }
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
    console.log("ATO ny traitement anlery", loginDto);
    let user
    try {
      user = await this.usersService.validateUser(
        loginDto.email,
        loginDto.password,
      );

      if (!user) {
        throw new UnauthorizedException('Email ou mot de passe invalide');
      }

    } catch (error) {
      // Log the full error for server-side debugging
      console.error('Authentication process error:', error);

      // Distinguish between expected and unexpected errors
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // For unexpected errors
      throw new HttpException(
        'Erreur interne lors de l\'authentification',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    }


    const payload = { email: user.email, sub: user.id };

    return {
      user,
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION', '1h'),
      }),
    };
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
        { expiresIn: '1h' }
      );

      this.emailClient.emit('password_reset_requested', {
        userId: user.id,
        email: user.email,
        token: resetToken
      });
    }
    // Nous ne renvoyons pas d'erreur si l'utilisateur n'existe pas pour des raisons de sécurité
  }
}