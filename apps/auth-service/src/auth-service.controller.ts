import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth/auth.service';
import { LoginDto, RegisterDto } from '@app/common';

@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register')
  async register(@Payload() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @MessagePattern('login')
  async login(@Payload() loginDto: LoginDto) {
    console.log("Requête de login reçue dans le microservice:", loginDto);
    try {
      const result = await this.authService.login(loginDto);
      console.log("Login réussi pour:", loginDto.email);
      return result;
    } catch (error) {
      console.error("Erreur de login:", error.message);
      // IMPORTANT: Utiliser RpcException au lieu de relancer l'erreur directement
      throw new RpcException({
        message: error.message || 'Erreur d\'authentification',
        statusCode:  error.statusCode || error.status || 401,
      });
    }
  }


  @MessagePattern('verify_email')
  async verifyEmail(@Payload() token: string) {
    return this.authService.verifyEmail(token);
  }

  @MessagePattern('request_password_reset')
  async requestPasswordReset(@Payload() data: { email: string }) {
    return this.authService.requestPasswordReset(data.email);
  }

  @MessagePattern('reset_password')
  async resetPassword(@Payload() data: { token: string; newPassword: string }) {
    return this.authService.resetPassword(data.token, data.newPassword);
  }

  @MessagePattern('get_user_profile')
  async getUserProfile(@Payload() userId: string) {
    console.log(`Requête de profil reçue pour l'utilisateur ID: ${userId}`);
    try {
      return await this.authService.getUserProfile(userId);
    } catch (error) {
      console.error(`Erreur lors de la récupération du profil: ${error.message}`);
      throw new RpcException({
        message: error.message || 'Erreur lors de la récupération du profil',
        statusCode: error.status || 404
      });
    }
  }
}