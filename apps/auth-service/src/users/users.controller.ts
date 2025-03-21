import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Put, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserResponseDto } from '@app/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'apps/api-gateway/src/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Obtenir le profil de l\'utilisateur connecté' })
    @ApiResponse({ status: 200, description: 'Profil récupéré avec succès' })
    @ApiResponse({ status: 401, description: 'Non authentifié' })
    async getProfile(@Req() req): Promise<UserResponseDto | null> {
        console.log("Controller: getProfile appelé avec userId:", req.user.userId);
        return this.usersService.findOneById(req.user.userId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Obtenir un utilisateur par ID' })
    @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
    @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
    @ApiResponse({ status: 401, description: 'Non authentifié' })
    async findOne(@Param('id') id: string, @Req() req): Promise<UserResponseDto | null> {
        // Vérifier que l'utilisateur a le droit de consulter ce profil
        // Par exemple, seul l'utilisateur lui-même ou un admin peut voir son profil
        if (req.user.userId !== id) {
            throw new UnauthorizedException('Vous n\'êtes pas autorisé à consulter ce profil');
        }
        
        return this.usersService.findOneById(id);
    }
}