// api-gateway/src/app.controller.ts
import { Controller, Post, Body, Get, UseGuards, Request, UseInterceptors, UploadedFile, Param, Delete, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
  ApiBearerAuth, 
  ApiBody, 
  ApiConsumes, 
  ApiOperation, 
  ApiParam, 
  ApiQuery, 
  ApiResponse, 
  ApiTags 
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto, RegisterDto } from '@app/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('auth')
  @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données d\'entrée invalides' })
  @ApiResponse({ status: 409, description: 'L\'utilisateur existe déjà' })
  @Post('auth/register')
  async register(@Body() registerDto: RegisterDto) {
    return this.appService.register(registerDto);
  }

  @ApiTags('auth')
  @ApiOperation({ summary: 'Connexion d\'un utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur connecté avec succès' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    return this.appService.login(loginDto);
  }

  @ApiTags('auth')
  @ApiOperation({ summary: 'Vérification de l\'email d\'un utilisateur' })
  @ApiQuery({ name: 'token', description: 'Token de vérification envoyé par email' })
  @ApiResponse({ status: 200, description: 'Email vérifié avec succès' })
  @ApiResponse({ status: 401, description: 'Token invalide ou expiré' })
  @Get('auth/verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.appService.verifyEmail(token);
  }

  @ApiTags('files')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Téléversement d\'un fichier' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Fichier à téléverser (PDF ou JPEG uniquement)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Fichier téléversé avec succès' })
  @ApiResponse({ status: 400, description: 'Format de fichier invalide ou taille trop grande' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @UseGuards(JwtAuthGuard)
  @Post('files/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.appService.uploadFile(file, req.user.userId);
  }

  @ApiTags('files')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupération de tous les fichiers d\'un utilisateur' })
  @ApiResponse({ status: 200, description: 'Liste des fichiers récupérée avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @UseGuards(JwtAuthGuard)
  @Get('files')
  async getFiles(@Request() req) {
    return this.appService.getFilesByUserId(req.user.userId);
  }

  @ApiTags('files')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupération d\'un fichier spécifique' })
  @ApiParam({ name: 'id', description: 'ID du fichier à récupérer' })
  @ApiResponse({ status: 200, description: 'Fichier récupéré avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Fichier non trouvé' })
  @UseGuards(JwtAuthGuard)
  @Get('files/:id')
  async getFile(@Param('id') id: string, @Request() req) {
    return this.appService.getFileById(id, req.user.userId);
  }

  @ApiTags('files')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Suppression d\'un fichier' })
  @ApiParam({ name: 'id', description: 'ID du fichier à supprimer' })
  @ApiResponse({ status: 200, description: 'Fichier supprimé avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Fichier non trouvé' })
  @UseGuards(JwtAuthGuard)
  @Delete('files/:id')
  async deleteFile(@Param('id') id: string, @Request() req) {
    return this.appService.deleteFile(id, req.user.userId);
  }

  @ApiTags('auth')
  @ApiOperation({ summary: 'Demande de réinitialisation de mot de passe' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'user@example.com',
          description: 'Adresse email de l\'utilisateur',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Email de réinitialisation envoyé si l\'adresse existe' })
  @Post('auth/request-password-reset')
  async requestPasswordReset(@Body() body: { email: string }) {
    return this.appService.requestPasswordReset(body.email);
  }

  @ApiTags('auth')
  @ApiOperation({ summary: 'Réinitialisation du mot de passe' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Token de réinitialisation reçu par email',
        },
        newPassword: {
          type: 'string',
          example: 'NewPassword123',
          description: 'Nouveau mot de passe',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Mot de passe réinitialisé avec succès' })
  @ApiResponse({ status: 401, description: 'Token invalide ou expiré' })
  @Post('auth/reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.appService.resetPassword(body.token, body.newPassword);
  }

  @ApiTags('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupération du profil utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil utilisateur récupéré avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.appService.getUserProfile(req.user.userId);
  }
}