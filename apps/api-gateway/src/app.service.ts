import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto, RegisterDto, UserResponseDto } from '@app/common';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('FILE_SERVICE') private fileClient: ClientProxy,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    return firstValueFrom(
      this.authClient.send('register', registerDto)
    );
  }

  async login(loginDto: LoginDto) {
    return firstValueFrom(
      this.authClient.send('login', loginDto)
    );
  }

  async verifyEmail(token: string) {
    return firstValueFrom(
      this.authClient.send('verify_email', token)
    );
  }

  async uploadFile(file: Express.Multer.File, userId: string) {
    return firstValueFrom(
      this.fileClient.send('upload_file', { file, userId })
    );
  }

  async getFilesByUserId(userId: string) {
    return firstValueFrom(
      this.fileClient.send('get_files_by_user', userId)
    );
  }

  async deleteFile(fileId: string, userId: string) {
    return firstValueFrom(
      this.fileClient.send('delete_file', { fileId, userId })
    );
  }
}