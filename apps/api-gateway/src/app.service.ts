import { Injectable, Inject, HttpException, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { LoginDto, RegisterDto, UserResponseDto } from '@app/common';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('FILE_SERVICE') private fileClient: ClientProxy,
  ) { }

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    try {
      return await firstValueFrom(
        this.authClient.send('register', registerDto).pipe(
          timeout(10000),
          catchError(err => {
            console.error('Erreur lors de l\'inscription:', err.message);
            return throwError(() => err);
          })
        )
      );
    } catch (error) {
      console.error('Erreur dans le processus d\'inscription:', error.message);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    console.log('Gateway: tentative de login pour:', loginDto.email);
    
    try {
      const response = await firstValueFrom(
        this.authClient.send('login', loginDto).pipe(
          timeout(10000),
          catchError(err => {
            console.error('Gateway: erreur login interceptée:', JSON.stringify(err, null, 2));
            
            // Vérification détaillée de la structure de l'erreur
            if (err && err.error) {
              // Format RpcException
              if (typeof err.error === 'object') {
                const rpcError = err.error;
                // Conserver le code d'état d'origine
                return throwError(() => new HttpException(
                  {
                    statusCode: rpcError.statusCode || 401,
                    message: rpcError.message || 'Erreur d\'authentification',
                    error: rpcError.error || 'Unauthorized'
                  },
                  rpcError.statusCode || 401
                ));
              } 
              // Chaîne simple
              else if (typeof err.error === 'string') {
                return throwError(() => new UnauthorizedException(err.error));
              }
            }
            
            // Fallback pour les erreurs non structurées
            return throwError(() => new UnauthorizedException(
              err.message || 'Erreur d\'authentification'
            ));
          })
        )
      );
      
      console.log('Gateway: login réussi pour:', loginDto.email);
      return response;
    } catch (error) {
      console.error('Gateway: erreur login:', error.message);
      throw error; // L'erreur est déjà formatée
    }
  }

  async verifyEmail(token: string) {
    try {
      return await firstValueFrom(
        this.authClient.send('verify_email', token).pipe(
          timeout(10000),
          catchError(err => {
            console.error('Erreur lors de la vérification de l\'email:', err.message);
            return throwError(() => err);
          })
        )
      );
    } catch (error) {
      console.error('Erreur dans le processus de vérification de l\'email:', error.message);
      throw error;
    }
  }

  async uploadFile(file: Express.Multer.File, userId: string) {
    console.log('Gateway: préparation upload pour utilisateur:', userId, {
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      hasBuffer: !!file.buffer
    });
    
    try {
      // Convertir le buffer en Base64 String pour le transport via RabbitMQ
      const fileToSend = {
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        // Stocker le buffer sous forme de string base64
        bufferBase64: file.buffer.toString('base64'),
        size: file.size
      };
      
      return await firstValueFrom(
        this.fileClient.send('upload_file', { 
          file: fileToSend, 
          userId 
        }).pipe(
          timeout(30000),
          catchError(err => {
            console.error('Erreur lors du téléversement de fichier:', err);
            // S'assurer que l'erreur a un code de statut HTTP valide (nombre entier)
            const statusCode = typeof err.status === 'number' ? err.status : 500;
            
            return throwError(() => new HttpException(
              err.message || 'Erreur lors du téléversement de fichier',
              statusCode
            ));
          })
        )
      );
    } catch (error) {
      console.error('Erreur dans le processus de téléversement de fichier:', error.message);
      throw error;
    }
  }

  async getFilesByUserId(userId: string) {
    try {
      return await firstValueFrom(
        this.fileClient.send('get_files_by_user', userId).pipe(
          timeout(10000),
          catchError(err => {
            console.error('Erreur lors de la récupération des fichiers:', err.message);
            return throwError(() => err);
          })
        )
      );
    } catch (error) {
      console.error('Erreur dans le processus de récupération des fichiers:', error.message);
      throw error;
    }
  }

  async deleteFile(fileId: string, userId: string) {
    try {
      return await firstValueFrom(
        this.fileClient.send('delete_file', { fileId, userId }).pipe(
          timeout(10000),
          catchError(err => {
            console.error('Erreur lors de la suppression du fichier:', err.message);
            return throwError(() => err);
          })
        )
      );
    } catch (error) {
      console.error('Erreur dans le processus de suppression de fichier:', error.message);
      throw error;
    }
  }

  async getFileById(fileId: string, userId: string) {
    try {
      return await firstValueFrom(
        this.fileClient.send('get_file_by_id', { fileId, userId }).pipe(
          timeout(10000),
          catchError(err => {
            console.error('Erreur lors de la récupération du fichier:', err.message);
            return throwError(() => err);
          })
        )
      );
    } catch (error) {
      console.error('Erreur dans le processus de récupération de fichier:', error.message);
      throw error;
    }
  }

  async requestPasswordReset(email: string) {
    try {
      return await firstValueFrom(
        this.authClient.send('request_password_reset', { email }).pipe(
          timeout(10000),
          catchError(err => {
            console.error('Erreur lors de la demande de réinitialisation de mot de passe:', err.message);
            return throwError(() => err);
          })
        )
      );
    } catch (error) {
      console.error('Erreur dans le processus de demande de réinitialisation de mot de passe:', error.message);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      return await firstValueFrom(
        this.authClient.send('reset_password', { token, newPassword }).pipe(
          timeout(10000),
          catchError(err => {
            console.error('Erreur lors de la réinitialisation du mot de passe:', err.message);
            return throwError(() => err);
          })
        )
      );
    } catch (error) {
      console.error('Erreur dans le processus de réinitialisation de mot de passe:', error.message);
      throw error;
    }
  }

  async getUserProfile(userId: string) {
    console.log(`Gateway: récupération du profil pour l'utilisateur ID: ${userId}`);
    
    try {
      return await firstValueFrom(
        this.authClient.send('get_user_profile', userId).pipe(
          timeout(10000),
          catchError(err => {
            console.error(`Gateway: erreur récupération profil:`, err);
            
            // Transformer l'erreur RPC en HttpException
            if (err.error && typeof err.error === 'object') {
              // C'est une RpcException
              const statusCode = err.error.statusCode || 500;
              const message = err.error.message || 'Erreur interne du serveur';
              return throwError(() => new HttpException(message, statusCode));
            }
            
            // Erreur non formatée
            return throwError(() => new HttpException(
              err.message || 'Erreur interne du serveur', 
              err.status || 500
            ));
          })
        )
      );
    } catch (error) {
      console.error(`Gateway: erreur profil:`, error.message);
      throw error; // L'erreur est déjà formatée par le catchError ci-dessus
    }
  }
}