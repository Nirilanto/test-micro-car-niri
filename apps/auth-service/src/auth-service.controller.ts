import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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
    console.log("KAIIIIIII!!! mipass leizyATO ZAO IZY MANDALO AA!!!!!!! api-gateway/src/app.controller.ts", loginDto);

    return this.authService.login(loginDto);
  }

  @MessagePattern('verify_email')
  async verifyEmail(@Payload() token: string) {
    return this.authService.verifyEmail(token);
  }
}