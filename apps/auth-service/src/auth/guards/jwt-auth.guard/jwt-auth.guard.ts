import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      console.warn('Tentative d\'accès sans token');
      throw new UnauthorizedException('Authentification requise');
    }
    
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      
      if (!jwtSecret) {
        console.error('JWT_SECRET non défini dans la configuration');
        throw new UnauthorizedException('Erreur de configuration du serveur');
      }
      
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret
      });
      
      console.log("User authentifié:", payload.sub);
      
      // Attacher l'utilisateur à la requête
      request['user'] = {
        userId: payload.sub,
        email: payload.email
      };
      
      return true;
    } catch(error) {
      console.warn(`Vérification de token échouée: ${error.message}`);
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}