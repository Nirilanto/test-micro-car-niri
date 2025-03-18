import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, UserResponseDto } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject('EMAIL_SERVICE') private emailClient: ClientProxy,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    // Créer l'utilisateur
    const user = await this.usersService.create(registerDto);
    
    // Émettre un événement pour envoyer un email de confirmation
    this.emailClient.emit('user_registered', { 
      userId: user.id,
      email: user.email,
    });
    
    return user;
  }

  async login(loginDto: LoginDto) {
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
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token);
      await this.usersService.markEmailAsVerified(payload.sub);
    } catch (error) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}